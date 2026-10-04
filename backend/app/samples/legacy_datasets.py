from typing import List, Dict

ENTERPRISE_SAMPLES: List[Dict[str, str]] = [
    {
        "id": "sample-delhi-logistics",
        "title": "Delhi Logistics Chaos (Messy 1-Line & Hinglish)",
        "category": "Supply Chain & Logistics",
        "description": "Unstructured single-line string with Hinglish landmark slangs ('peeli kothi', 'opp Sharma sweets', 'Dilli') and completely missing postal code.",
        "raw_content": "M/s Rajesh & Sons, Gali No 4, opp Sharma sweets, near peeli kothi, Dilli. Ph: 9811234567, GSTIN: 07AAAAA0000A1Z5, rajeshsons.delhi@gmail.com"
    },
    {
        "id": "sample-mumbai-invoice",
        "title": "Chaotic Mumbai Invoice (Colloquial C/O & Missing State)",
        "category": "Enterprise ERP Invoicing",
        "description": "Legacy ERP billing string with old city naming ('Bombay'), care-of salutation, missing state, and unformatted mobile contact.",
        "raw_content": "Shri Ganesh Enterprises, C/O Rameshwar Ji, 3rd flr flat 302, Bandra west, Bombay. Contact: 9820123456, PAN: ABCDE1234F"
    },
    {
        "id": "sample-varanasi-kyc",
        "title": "Rural Vernacular KYC Receipt (Hinglish Slang & Tehsil)",
        "category": "Banking & Microfinance KYC",
        "description": "Low-res scanned handwritten KYC with rural slang ('Vill-', 'taluka ke bagal mein'), family honorifics, and zero postal index.",
        "raw_content": "Handwritten KYC: Smt Rekha Devi w/o Suresh Kumar, Vill- Rampur, Post- Kothari, taluka Varanasi ke bagal mein, UP. Mob- 9415201234, rekha.kirana@gmail.com"
    },
    {
        "id": "sample-bangalore-tech",
        "title": "Bengaluru Tech Park Vendor (Multi-Line Mixed CSV)",
        "category": "Corporate Vendor Master",
        "description": "Mixed multi-line procurement data with landmark signal navigation ('Near Sony World Signal') and missing PIN code.",
        "raw_content": "CloudScale Systems Pvt Ltd, 4th Cross, Near Sony World Signal, Koramangala 4th Block, Bengaluru. Contact: +91 80 4123 4567, GSTIN: 29ABCDE1234F1Z5, billing@cloudscale.io"
    }
]
