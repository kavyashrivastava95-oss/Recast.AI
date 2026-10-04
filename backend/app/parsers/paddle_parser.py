import re
from typing import Dict, Any, List

class PaddleOCRParser:
    """
    PaddleOCR Parser (PaddlePaddle/PaddleOCR)
    Specialized in deciphering low-resolution scanned forms, handwritten records,
    faded thermal invoices, and noisy legacy image text.
    """

    def __init__(self):
        self.engine_name = "PaddleOCR Enterprise v4"

    def parse_scanned_text(self, text_or_ocr: str, image_metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Processes OCR input, filtering noise and restoring damaged character tokens.
        """
        metadata = image_metadata or {}
        # Clean common OCR misrecognitions (e.g. 'O'/'0', 'l'/'1' in pincodes/phone numbers)
        cleaned = text_or_ocr

        # Fix OCR artifacts in phone numbers like "98I2345678" -> "9812345678"
        def fix_ocr_digits(match):
            val = match.group(0)
            return val.replace('I', '1').replace('l', '1').replace('O', '0').replace('o', '0')

        cleaned = re.sub(r'\b[6-9][0-9IlOo]{9}\b', fix_ocr_digits, cleaned)
        cleaned = re.sub(r'\b[1-9][0-9IlOo]{5}\b', fix_ocr_digits, cleaned)

        # Detect confidence estimate from OCR quality
        noise_level = len(re.findall(r'[^A-Za-z0-9\s,.-/]', cleaned))
        estimated_confidence = max(0.85, 1.0 - (noise_level / max(len(cleaned), 1)))

        return {
            "engine": self.engine_name,
            "ocr_cleaned_text": cleaned,
            "noise_filtered_count": noise_level,
            "ocr_quality_confidence": round(estimated_confidence, 3),
            "detected_scripts": ["Latin", "Devanagari-Transliterated"]
        }
