/**
 * Enterprise Name Intelligence & Decomposition Engine
 * Handles full extraction, cleansing, and multi-part decomposition:
 * - 1st Name (Given / Forename)
 * - Middle Name
 * - Last Name (Surname / Family Name)
 * - Salutations / Honorifics (Shri, Smt, Dr, Mr, Mrs, Ms, Prof, etc.)
 * - Relational Markers (w/o, s/o, d/o, c/o, care of, son of, etc.)
 */

export interface DecomposedName {
  full_name_clean: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  salutation: string;
  relationship: string;
}

/**
 * Capitalizes a word properly (handles names with hyphen or apostrophe)
 */
export function titleCaseWord(word: string): string {
  if (!word) return "";
  // Preserve all-caps initials like "S." or "A." or "Pvt"
  if (/^[A-Z]\.?$/.test(word)) return word.toUpperCase();
  if (/^(pvt|ltd|inc|llc|corp)\.?$/i.test(word)) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function titleCaseName(str: string): string {
  return str
    .split(/\s+/)
    .map((w) => titleCaseWord(w))
    .join(" ");
}

/**
 * Decomposes and normalizes any messy name string into 1st Name, Middle Name, Last Name
 */
export function decomposeName(
  rawInput: string,
  entityType?: "INDIVIDUAL" | "ENTERPRISE" | "VENDOR" | "LOGISTICS_HUB"
): DecomposedName {
  if (!rawInput || !rawInput.trim()) {
    return {
      full_name_clean: "Not Provided",
      first_name: "",
      middle_name: "",
      last_name: "",
      salutation: "",
      relationship: "",
    };
  }

  const text = rawInput.trim();

  // 1. Check for explicit labeled key-value formats:
  // e.g., "First Name: Rahul, Middle Name: Kumar, Last Name: Sharma"
  const explicitFirst = text.match(/\b(?:first|1st|given)[\s_-]?name[\s:]+([A-Za-z]+)/i);
  const explicitMiddle = text.match(/\b(?:middle|mid)[\s_-]?name[\s:]+([A-Za-z]+)/i);
  const explicitLast = text.match(/\b(?:last|sur|family)[\s_-]?name[\s:]+([A-Za-z]+)/i);

  if (explicitFirst || explicitLast) {
    const fName = explicitFirst ? titleCaseWord(explicitFirst[1]) : "";
    const mName = explicitMiddle ? titleCaseWord(explicitMiddle[1]) : "";
    const lName = explicitLast ? titleCaseWord(explicitLast[1]) : "";
    const fullClean = [fName, mName, lName].filter(Boolean).join(" ");

    return {
      full_name_clean: fullClean || "Clean Entity Name",
      first_name: fName,
      middle_name: mName,
      last_name: lName,
      salutation: "",
      relationship: "",
    };
  }

  // 2. Extract first line if multi-line block
  let target = text.split("\n")[0].trim();

  // Remove common document header prefixes
  target = target
    .replace(/^(?:name|customer name|client name|entity|vendor|party name|handwritten kyc|bill to|sold to|shipped to)[\s:.-]+/i, "")
    .trim();

  // 3. Extract Relational markers (w/o, s/o, d/o, c/o, care of, wife of, son of)
  let relationship = "";
  const relMatch = target.match(
    /\b(w\/o|s\/o|d\/o|c\/o|care\s+of|wife\s+of|son\s+of|daughter\s+of)\s+([A-Za-z\s]+?)(?:,|$|\b(?:vill|gali|road|street|plot|flat|post|taluka|house|kothi|dukan|sector)\b)/i
  );
  if (relMatch) {
    relationship = `${relMatch[1].trim()} ${titleCaseName(relMatch[2].trim())}`.trim();
    // Remove relationship snippet from the target name candidate
    target = target.replace(relMatch[0], "").trim();
  }

  // 4. Extract Salutations & Honorifics
  let salutation = "";
  const salutationMatch = target.match(
    /^(?:(m\/s|messrs|shri|shree|smt|smt\.|mr|mr\.|mrs|mrs\.|ms|ms\.|miss|dr|dr\.|prof|prof\.|er|er\.|adv|adv\.|md\.|mohd\.|master|late))\b[\s.-]*/i
  );
  if (salutationMatch) {
    salutation = titleCaseWord(salutationMatch[1].replace(/\.$/, ""));
    target = target.slice(salutationMatch[0].length).trim();
  }

  // 5. Check for "Last, First Middle" format (e.g. "Verma, Neha Kumari, Flat 12B...")
  const commaInversionMatch = target.match(/^([A-Za-z]+),\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)(?:,|$|\b(?:flat|plot|house|road|gali|street|sector|mob|ph|near|opp|vill|post)\b)/i);
  if (commaInversionMatch) {
    const surname = titleCaseWord(commaInversionMatch[1]);
    const givenTokens = commaInversionMatch[2].split(/\s+/).map((w) => titleCaseWord(w));
    const firstName = givenTokens[0] || "";
    const middleName = givenTokens.slice(1).join(" ") || "";
    const full = [firstName, middleName, surname].filter(Boolean).join(" ");
    return {
      full_name_clean: full,
      first_name: firstName,
      middle_name: middleName,
      last_name: surname,
      salutation,
      relationship,
    };
  }

  // 6. Cut off address or landmark noise after comma or street keywords
  const addressSplit = target.split(
    /,|\b(?:gali|road|street|plot|flat|floor|house|kothi|dukan|near|opp|vill|post|taluka|sector|mob|ph|gstin|pan|email)\b/i
  );
  let cleanCandidate = (addressSplit[0] || "").trim();

  // Clean remaining punctuation noise like brackets, trailing colons
  cleanCandidate = cleanCandidate.replace(/^[^\w]+|[^\w]+$/g, "").replace(/\s{2,}/g, " ");

  if (!cleanCandidate) {
    return {
      full_name_clean: entityType === "ENTERPRISE" ? "Enterprise Entity" : "Individual Client",
      first_name: "",
      middle_name: "",
      last_name: "",
      salutation,
      relationship,
    };
  }

  // 7. Normal Token Decomposition
  const tokens = cleanCandidate
    .split(/\s+/)
    .map((w) => titleCaseWord(w))
    .filter(Boolean);

  let firstName = "";
  let middleName = "";
  let lastName = "";

  if (tokens.length === 0) {
    firstName = "Entity";
  } else if (tokens.length === 1) {
    firstName = tokens[0];
  } else if (tokens.length === 2) {
    firstName = tokens[0];
    lastName = tokens[1];
  } else if (tokens.length === 3) {
    firstName = tokens[0];
    middleName = tokens[1];
    lastName = tokens[2];
  } else {
    // 4 or more tokens
    firstName = tokens[0];
    middleName = tokens.slice(1, -1).join(" ");
    lastName = tokens[tokens.length - 1];
  }

  // Enterprise specific adjustments:
  // e.g. "CloudScale Systems Pvt Ltd" -> 1st: "CloudScale", Mid: "Systems", Last: "Pvt Ltd"
  if (tokens.length >= 3 && /^(pvt|ltd|inc|corp|co\.|industries|enterprises|traders|sons)$/i.test(tokens[tokens.length - 1])) {
    if (tokens.length === 4 && /^(pvt)$/i.test(tokens[tokens.length - 2]) && /^(ltd)$/i.test(tokens[tokens.length - 1])) {
      firstName = tokens[0];
      middleName = tokens.length > 3 ? tokens.slice(1, 2).join(" ") : "";
      lastName = "Pvt Ltd";
    }
  }

  const fullClean = [firstName, middleName, lastName].filter(Boolean).join(" ");

  return {
    full_name_clean: fullClean,
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    salutation,
    relationship,
  };
}
