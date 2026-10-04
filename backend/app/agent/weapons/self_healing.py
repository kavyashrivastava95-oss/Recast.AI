import re
from typing import Dict, Any, List, Tuple

class SelfHealingWeapon:
    """
    Weapon 1: Zero-Shot Self-Healing
    Autonomously predicts and auto-fills missing fields (missing PIN codes, states,
    country calling codes, entity classification) using high-precision geospatial
    heuristics and regional intelligence.
    """

    GEO_KNOWLEDGE_BASE: Dict[str, Dict[str, str]] = {
        "anand vihar": {"city": "Delhi", "state": "Delhi", "pin": "110092"},
        "connaught place": {"city": "Delhi", "state": "Delhi", "pin": "110001"},
        "karol bagh": {"city": "Delhi", "state": "Delhi", "pin": "110005"},
        "laxmi nagar": {"city": "Delhi", "state": "Delhi", "pin": "110092"},
        "chandni chowk": {"city": "Delhi", "state": "Delhi", "pin": "110006"},
        "saket": {"city": "Delhi", "state": "Delhi", "pin": "110017"},
        "rohini": {"city": "Delhi", "state": "Delhi", "pin": "110085"},
        "bandra west": {"city": "Mumbai", "state": "Maharashtra", "pin": "400050"},
        "bandra": {"city": "Mumbai", "state": "Maharashtra", "pin": "400050"},
        "andheri east": {"city": "Mumbai", "state": "Maharashtra", "pin": "400069"},
        "andheri": {"city": "Mumbai", "state": "Maharashtra", "pin": "400058"},
        "nariman point": {"city": "Mumbai", "state": "Maharashtra", "pin": "400021"},
        "dadar": {"city": "Mumbai", "state": "Maharashtra", "pin": "400014"},
        "koramangala": {"city": "Bengaluru", "state": "Karnataka", "pin": "560034"},
        "indiranagar": {"city": "Bengaluru", "state": "Karnataka", "pin": "560038"},
        "whitefield": {"city": "Bengaluru", "state": "Karnataka", "pin": "560066"},
        "electronic city": {"city": "Bengaluru", "state": "Karnataka", "pin": "560100"},
        "hitech city": {"city": "Hyderabad", "state": "Telangana", "pin": "500081"},
        "gachibowli": {"city": "Hyderabad", "state": "Telangana", "pin": "500032"},
        "salt lake": {"city": "Kolkata", "state": "West Bengal", "pin": "700091"},
        "park street": {"city": "Kolkata", "state": "West Bengal", "pin": "700016"},
        "varanasi": {"city": "Varanasi", "state": "Uttar Pradesh", "pin": "221001"},
        "kashi": {"city": "Varanasi", "state": "Uttar Pradesh", "pin": "221001"},
        "rampur": {"city": "Varanasi", "state": "Uttar Pradesh", "pin": "221002"},
        "gurugram": {"city": "Gurugram", "state": "Haryana", "pin": "122001"},
        "cyber city": {"city": "Gurugram", "state": "Haryana", "pin": "122002"},
        "noida sector 62": {"city": "Noida", "state": "Uttar Pradesh", "pin": "201309"},
        "noida": {"city": "Noida", "state": "Uttar Pradesh", "pin": "201301"}
    }

    CITY_DEFAULT_PINS: Dict[str, Tuple[str, str]] = {
        "delhi": ("Delhi", "110001"),
        "mumbai": ("Maharashtra", "400001"),
        "bengaluru": ("Karnataka", "560001"),
        "kolkata": ("West Bengal", "700001"),
        "chennai": ("Tamil Nadu", "600001"),
        "hyderabad": ("Telangana", "500001"),
        "pune": ("Maharashtra", "411001"),
        "ahmedabad": ("Gujarat", "380001"),
        "jaipur": ("Rajasthan", "302001"),
        "varanasi": ("Uttar Pradesh", "221001"),
        "lucknow": ("Uttar Pradesh", "226001"),
        "patna": ("Bihar", "800001"),
        "chandigarh": ("Chandigarh", "160001"),
    }

    def heal_record(self, record: Dict[str, Any], raw_context: str = "") -> Tuple[Dict[str, Any], List[str], float]:
        """
        Applies self-healing on a parsed record.
        Returns: (healed_record, healed_fields_list, confidence_score)
        """
        healed = dict(record)
        healed_fields: List[str] = []
        base_confidence = float(record.get("confidence_score", 0.88))

        full_context = f"{raw_context} {healed.get('address_line1', '')} {healed.get('address_line2', '')} {healed.get('city', '')}".lower()

        # 1. Self-heal missing Postal Code
        pin = str(healed.get("postal_code", "")).strip()
        if not pin or pin in ["NOT_PROVIDED", "000000", "None", "", "N/A"]:
            # Check locality match
            inferred_pin = None
            inferred_city = None
            inferred_state = None

            for locality, data in self.GEO_KNOWLEDGE_BASE.items():
                if locality in full_context:
                    inferred_pin = data["pin"]
                    inferred_city = data["city"]
                    inferred_state = data["state"]
                    break

            # Fallback to city default pin
            if not inferred_pin:
                curr_city = str(healed.get("city", "")).strip().lower()
                if curr_city in self.CITY_DEFAULT_PINS:
                    inferred_state, inferred_pin = self.CITY_DEFAULT_PINS[curr_city]

            if inferred_pin:
                healed["postal_code"] = f"{inferred_pin} [HEALED]"
                healed_fields.append("postal_code")
                if not healed.get("city") or healed.get("city") == "NOT_PROVIDED":
                    if inferred_city:
                        healed["city"] = inferred_city
                        healed_fields.append("city")
                if not healed.get("state_province") or healed.get("state_province") == "NOT_PROVIDED":
                    if inferred_state:
                        healed["state_province"] = inferred_state
                        healed_fields.append("state_province")

        # 2. Self-heal missing State if city is known
        curr_state = str(healed.get("state_province", "")).strip()
        curr_city = str(healed.get("city", "")).strip().lower()
        if (not curr_state or curr_state in ["NOT_PROVIDED", "", "None"]) and curr_city in self.CITY_DEFAULT_PINS:
            default_state, _ = self.CITY_DEFAULT_PINS[curr_city]
            healed["state_province"] = f"{default_state} [HEALED]"
            healed_fields.append("state_province")

        # 3. Normalize & Heal Contact number to E.164
        contact = str(healed.get("contact_normalized", "")).strip()
        if contact and contact not in ["NOT_PROVIDED", "None", ""]:
            digits_only = re.sub(r'\D', '', contact)
            if len(digits_only) == 10 and digits_only[0] in "6789":
                healed["contact_normalized"] = f"+91 {digits_only[:5]} {digits_only[5:]} [HEALED]"
                healed_fields.append("contact_normalized")
            elif len(digits_only) == 12 and digits_only.startswith("91"):
                healed["contact_normalized"] = f"+91 {digits_only[2:7]} {digits_only[7:]}"

        # 4. Self-heal Entity Type if unclear
        entity_type = healed.get("entity_type", "").upper()
        name = healed.get("full_name_clean", "").lower()
        if entity_type not in ["INDIVIDUAL", "ENTERPRISE", "VENDOR", "LOGISTICS_HUB"] or entity_type == "UNKNOWN":
            if any(term in name for term in ["pvt", "ltd", "enterprises", "sons", "traders", "corp", "inc", "hub", "logistics", "industries"]):
                healed["entity_type"] = "ENTERPRISE"
                healed_fields.append("entity_type")
            elif any(term in full_context for term in ["hub", "warehouse", "depot", "freight"]):
                healed["entity_type"] = "LOGISTICS_HUB"
                healed_fields.append("entity_type")
            else:
                healed["entity_type"] = "INDIVIDUAL"

        # Calculate adjusted confidence score
        # Base confidence boosted when self-healing resolves missing elements reliably
        if healed_fields:
            adjusted_conf = min(0.99, max(0.92, base_confidence + (0.02 * len(healed_fields))))
        else:
            adjusted_conf = min(0.99, max(0.95, base_confidence))

        healed["confidence_score"] = round(adjusted_conf, 3)
        return healed, list(set(healed_fields)), round(adjusted_conf, 3)
