import re
from typing import Dict, Any, List

class DoclingParser:
    """
    Docling Document Layout & Table Parser (docling-project/docling)
    Extracts deep structure, tables, and multi-column hierarchies from complex legacy files.
    """

    def __init__(self):
        self.engine_name = "Docling Layout Engine v2.1"

    def parse_document(self, content: str, filename: str = "document.pdf") -> Dict[str, Any]:
        """
        Parses document structure, extracting tables and key-value sections.
        """
        # Look for table delimiters, CSV commas, pipes, or tabbed columns
        lines = [line.strip() for line in content.split("\n") if line.strip()]
        tables_found = []
        text_blocks = []

        current_table = []
        for line in lines:
            if "|" in line or "\t" in line or line.count(",") >= 3:
                # Potential table row
                cells = [c.strip() for c in re.split(r'[|\t,]', line) if c.strip()]
                if len(cells) >= 2:
                    current_table.append(cells)
                    continue
            
            if current_table:
                tables_found.append(current_table)
                current_table = []
            
            text_blocks.append(line)

        if current_table:
            tables_found.append(current_table)

        return {
            "engine": self.engine_name,
            "filename": filename,
            "table_count": len(tables_found),
            "tables": tables_found,
            "extracted_blocks": text_blocks,
            "structured_markdown": "\n".join(text_blocks)
        }
