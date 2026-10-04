import time
from typing import Dict, Any
from .docling_parser import DoclingParser
from .paddle_parser import PaddleOCRParser
from .unstructured_parser import UnstructuredDocumentParser

class UnifiedDocumentPipeline:
    """
    Unified Open-Source Document Parsing Pipeline
    Coordinating Docling, PaddleOCR, and Unstructured-IO to extract clean text representations
    from complex enterprise documents, scans, and tables.
    """

    def __init__(self):
        self.docling = DoclingParser()
        self.paddle = PaddleOCRParser()
        self.unstructured = UnstructuredDocumentParser()

    def process(self, raw_input: str, filename: str = "legacy_payload.txt") -> Dict[str, Any]:
        start_t = time.perf_counter()

        # Step 1: Paddle OCR noise filter and digit repair
        ocr_result = self.paddle.parse_scanned_text(raw_input)
        cleaned_text = ocr_result["ocr_cleaned_text"]

        # Step 2: Docling table & layout inspection
        docling_result = self.docling.parse_document(cleaned_text, filename=filename)

        # Step 3: Unstructured partition elements
        elements = self.unstructured.partition_elements(cleaned_text)

        elapsed_ms = (time.perf_counter() - start_t) * 1000

        return {
            "cleaned_text": cleaned_text,
            "elements": elements,
            "docling_meta": docling_result,
            "paddle_meta": ocr_result,
            "pipeline_time_ms": round(elapsed_ms, 2)
        }
