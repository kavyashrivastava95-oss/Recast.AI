import re
from typing import Dict, Any, List

class UnstructuredDocumentParser:
    """
    Unstructured Document Parser (Unstructured-IO/unstructured)
    Splits arbitrary messy enterprise dumps into semantic elements:
    Header, AddressBlock, ContactInfo, TaxIdentifier, Narrative.
    """

    def __init__(self):
        self.engine_name = "Unstructured IO Core v0.15"

    def partition_elements(self, raw_text: str) -> List[Dict[str, Any]]:
        """
        Partitions messy legacy text into structured semantic elements.
        """
        elements: List[Dict[str, Any]] = []
        raw_chunks = [c.strip() for c in re.split(r'\n{2,}|\r\n{2,}|;\s*', raw_text) if c.strip()]

        for idx, chunk in enumerate(raw_chunks):
            # Classify element type
            element_type = "NarrativeText"
            if re.search(r'\b(?:pvt|ltd|enterprises|traders|sons|corp|co\.)\b', chunk, re.IGNORECASE):
                element_type = "OrganizationHeader"
            elif re.search(r'\b(?:gali|road|street|nagar|sector|colony|flat|floor|building)\b', chunk, re.IGNORECASE):
                element_type = "AddressBlock"
            elif re.search(r'\b(?:\+91|ph|mob|phone|email)\b', chunk, re.IGNORECASE):
                element_type = "ContactInfo"
            elif re.search(r'\b(?:gst|pan|tin|ein|tax)\b', chunk, re.IGNORECASE):
                element_type = "TaxIdentifier"

            elements.append({
                "element_id": f"elem-{idx+1}",
                "type": element_type,
                "text": chunk
            })

        return elements
