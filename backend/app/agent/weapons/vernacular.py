import re
from typing import Tuple, List, Dict

class VernacularWeapon:
    """
    Weapon 3: Vernacular Parser
    Decodes Hinglish expressions, regional colloquialisms, landmark idioms,
    and Indian street slangs into standardized enterprise geospatial components.
    """

    CITY_STANDARDIZATION: Dict[str, Tuple[str, str]] = {
        "dilli": ("Delhi", "Delhi"),
        "new delhi": ("New Delhi", "Delhi"),
        "delhi": ("Delhi", "Delhi"),
        "bombay": ("Mumbai", "Maharashtra"),
        "mumbai": ("Mumbai", "Maharashtra"),
        "kalkatta": ("Kolkata", "West Bengal"),
        "calcutta": ("Kolkata", "West Bengal"),
        "kolkata": ("Kolkata", "West Bengal"),
        "madras": ("Chennai", "Tamil Nadu"),
        "chennai": ("Chennai", "Tamil Nadu"),
        "bangalore": ("Bengaluru", "Karnataka"),
        "bengaluru": ("Bengaluru", "Karnataka"),
        "gurgaon": ("Gurugram", "Haryana"),
        "gurugram": ("Gurugram", "Haryana"),
        "poona": ("Pune", "Maharashtra"),
        "pune": ("Pune", "Maharashtra"),
        "baroda": ("Vadodara", "Gujarat"),
        "vadodara": ("Vadodara", "Gujarat"),
        "benaras": ("Varanasi", "Uttar Pradesh"),
        "kashi": ("Varanasi", "Uttar Pradesh"),
        "varanasi": ("Varanasi", "Uttar Pradesh"),
        "allahabad": ("Prayagraj", "Uttar Pradesh"),
        "prayagraj": ("Prayagraj", "Uttar Pradesh"),
        "cochin": ("Kochi", "Kerala"),
        "kochi": ("Kochi", "Kerala"),
        "trivandrum": ("Thiruvananthapuram", "Kerala"),
    }

    VERNACULAR_LANDMARK_MAP: Dict[str, str] = {
        "ke saamne": "Opposite",
        "ke samne": "Opposite",
        "ke bagal mein": "Adjacent To",
        "bagal me": "Adjacent To",
        "ke piche": "Behind",
        "ke peeche": "Behind",
        "ke paas": "Near",
        "peeli kothi": "Yellow Mansion Landmark",
        "lal darwaza": "Red Gate Landmark",
        "gol chakkar": "Roundabout",
        "bada chauraha": "Main Intersection",
        "chaurahe par": "Intersection",
        "naka": "Checkpoint Junction",
        "mohalla": "Colony / Sector",
        "basti": "Locality",
        "tehsil": "Sub-District Tehsil",
        "taluka": "Taluka Administrative Block",
        "gali no": "Street No.",
        "gali number": "Street No.",
        "dukan no": "Shop No.",
        "kothi no": "Bungalow No.",
        "makan no": "House No."
    }

    def normalize_vernacular_text(self, text: str) -> Tuple[str, List[str]]:
        """
        Normalizes Hinglish address tokens and records detected idioms.
        Returns: (normalized_text, resolved_terms_list)
        """
        resolved: List[str] = []
        cleaned = text

        # 1. Landmark prepositions and slang terms
        for vernacular_term, standard_term in self.VERNACULAR_LANDMARK_MAP.items():
            pattern = re.compile(re.escape(vernacular_term), re.IGNORECASE)
            if pattern.search(cleaned):
                cleaned = pattern.sub(standard_term, cleaned)
                resolved.append(f"Vernacular Idiom '{vernacular_term}' -> '{standard_term}'")

        # 2. City aliases
        for alias, (std_city, std_state) in self.CITY_STANDARDIZATION.items():
            pattern = re.compile(rf'\b{re.escape(alias)}\b', re.IGNORECASE)
            if pattern.search(cleaned):
                cleaned = pattern.sub(f"{std_city}, {std_state}", cleaned)
                resolved.append(f"Regional City '{alias.title()}' -> '{std_city}, {std_state}'")

        # 3. Clean common colloquial delimiters
        cleaned = re.sub(r'[\r\n]+', ', ', cleaned)
        cleaned = re.sub(r'\s{2,}', ' ', cleaned)
        cleaned = re.sub(r',\s*,', ',', cleaned)

        return cleaned.strip(), resolved
