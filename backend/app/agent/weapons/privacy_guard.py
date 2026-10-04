import re
import hashlib
import hmac
from typing import Tuple, Dict, Any, List

class PrivacyGuardWeapon:
    """
    Weapon 2: GDPR / DPDP Privacy Guard
    Cryptographically tokenizes PII (Names, Phone Numbers, Tax IDs, Emails)
    before sending data to any external LLM or cloud service.
    Complies with GDPR Article 32 & DPDP Act 2023.
    """

    def __init__(self, salt: str = "recast_enterprise_vault_secret_2026"):
        self.salt = salt.encode("utf-8")

    def _generate_token(self, pii_type: str, raw_val: str) -> str:
        digest = hmac.new(self.salt, raw_val.strip().lower().encode("utf-8"), hashlib.sha256).hexdigest()[:6]
        return f"[ENC_{pii_type.upper()}_{digest}]"

    def mask_pii(self, text: str) -> Tuple[str, Dict[str, str]]:
        """
        Masks detected PII in raw legacy text.
        Returns: (masked_text, token_to_original_map)
        """
        vault_map: Dict[str, str] = {}
        processed = text

        # 1. Indian Phone Numbers / Standard 10-12 digit numbers
        phone_patterns = [
            r'(?:(?:\+|00)91[\s.-]?)?(?:[6-9]\d{4}[\s.-]?\d{5})',
            r'\b\d{5}[\s.-]\d{5}\b',
            r'\b(?:mob|phone|ph|contact|tel)[\s:.-]*([+0-9\s-]{10,15})\b'
        ]
        for pattern in phone_patterns:
            matches = list(re.finditer(pattern, processed, re.IGNORECASE))
            for m in reversed(matches):
                val = m.group(0).strip()
                if len(re.sub(r'\D', '', val)) >= 10:
                    token = self._generate_token("PHONE", val)
                    vault_map[token] = val
                    processed = processed[:m.start()] + token + processed[m.end():]

        # 2. Email Addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        for m in reversed(list(re.finditer(email_pattern, processed))):
            val = m.group(0)
            token = self._generate_token("EMAIL", val)
            vault_map[token] = val
            processed = processed[:m.start()] + token + processed[m.end():]

        # 3. Indian GSTIN (15 characters: 2 state + 10 PAN + 1 entity + Z + 1 check)
        gstin_pattern = r'\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b'
        for m in reversed(list(re.finditer(gstin_pattern, processed))):
            val = m.group(0)
            token = self._generate_token("GSTIN", val)
            vault_map[token] = val
            processed = processed[:m.start()] + token + processed[m.end():]

        # 4. Indian PAN (10 chars: 5 uppercase letters + 4 digits + 1 uppercase letter)
        pan_pattern = r'\b[A-Z]{5}\d{4}[A-Z]{1}\b'
        for m in reversed(list(re.finditer(pan_pattern, processed))):
            val = m.group(0)
            # Avoid masking already masked tokens or pure common words
            if not val.startswith("ENC") and val not in ["DELHI", "PATNA", "BIHAR", "SURAT"]:
                token = self._generate_token("PAN", val)
                vault_map[token] = val
                processed = processed[:m.start()] + token + processed[m.end():]

        # 5. Salutation-prefixed Individual Names (Mr., Mrs., Smt., Shri, C/O, W/O, S/O)
        name_prefixes = [
            r'\b(?:c/o|care\s+of|w/o|s/o|d/o|shri|smt|mr\.|mrs\.|ms\.)\s+([A-Za-z]+(?:\s+[A-Za-z]+){1,3})\b'
        ]
        for pattern in name_prefixes:
            for m in reversed(list(re.finditer(pattern, processed, re.IGNORECASE))):
                full_match = m.group(0)
                name_part = m.group(1).strip()
                token = self._generate_token("NAME", name_part)
                vault_map[token] = name_part
                prefix = full_match[:m.start(1) - m.start(0)]
                replacement = f"{prefix}{token}"
                processed = processed[:m.start()] + replacement + processed[m.end():]

        return processed, vault_map

    def unmask_record(self, record_dict: Dict[str, Any], vault_map: Dict[str, str]) -> Dict[str, Any]:
        """
        Restores tokenized PII into actual values for secure client-side export
        when explicitly triggered by an authorized enterprise admin.
        """
        unmasked = {}
        for key, value in record_dict.items():
            if isinstance(value, str):
                val_str = value
                for token, orig in vault_map.items():
                    if token in val_str:
                        val_str = val_str.replace(token, orig)
                unmasked[key] = val_str
            else:
                unmasked[key] = value
        return unmasked
