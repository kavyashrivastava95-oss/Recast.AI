import time
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

from .config import settings
from .models.requests import ParseRequest, ParseResponse, ReverseSchemaRequest
from .models.schema import ReverseSchemaOutput
from .agent.orchestrator import RecastOrchestrator
from .agent.weapons.reverse_schema import ReverseSchemaWeapon
from .samples.legacy_datasets import ENTERPRISE_SAMPLES

app = FastAPI(
    title="Recast AI - Autonomous Enterprise Data Migration API",
    description="Autonomous enterprise agent converting chaotic legacy data into standardized 11-column schemas using Docling, PaddleOCR, Unstructured, LangGraph, and Gemma 4 multimodal reasoning.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = RecastOrchestrator()
reverse_schema_weapon = ReverseSchemaWeapon()

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Recast-AI Enterprise Agent",
        "version": settings.version,
        "weapons_online": [
            "Zero-Shot Self-Healing (Geospatial Inference)",
            "GDPR / DPDP Privacy Guard (HMAC-SHA256 Tokenization)",
            "Vernacular / Hinglish Address Parser",
            "Automated Cryptographic Audit Trail (Chained SHA-256)",
            "Reverse-Schema Generator (Postgres, Prisma, Pydantic, TS)"
        ],
        "open_source_stack": {
            "orchestrator": "LangGraph (langchain-ai/langgraph)",
            "document_layout": "Docling (docling-project/docling)",
            "ocr_engine": "PaddleOCR (PaddlePaddle/PaddleOCR)",
            "partitioning": "Unstructured-IO (Unstructured-IO/unstructured)",
            "multimodal_reasoning": "Google Gemma 4 / Gemini Multimodal Engine"
        }
    }

@app.get("/api/samples")
async def get_samples():
    return {
        "samples": ENTERPRISE_SAMPLES
    }

@app.post("/api/parse", response_model=ParseResponse)
async def parse_legacy_data(request: ParseRequest):
    if not request.raw_content.strip():
        raise HTTPException(status_code=400, detail="raw_content cannot be empty")

    try:
        result = orchestrator.execute({
            "raw_content": request.raw_content,
            "file_name": request.file_name or "manual_entry.txt",
            "privacy_guard": request.privacy_guard,
            "self_healing": request.self_healing,
            "vernacular_mode": request.vernacular_mode,
            "target_dialect": request.target_dialect or "IN_ENTERPRISE"
        })

        return ParseResponse(
            success=True,
            source_file=request.file_name or "manual_entry.txt",
            total_records=len(result["final_records"]),
            records=result["final_records"],
            audit_trail=result["audit_trail"],
            reverse_schema=result["reverse_schema"] or reverse_schema_weapon.generate_schemas(),
            processing_time_ms=result["total_time_ms"],
            pipeline_stages_executed=result["pipeline_stages"],
            weapons_engaged=result["weapons_engaged"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline execution error: {str(e)}")

@app.post("/api/upload", response_model=ParseResponse)
async def upload_document(
    file: UploadFile = File(...),
    privacy_guard: bool = Form(True),
    self_healing: bool = Form(True),
    vernacular_mode: bool = Form(True)
):
    try:
        content_bytes = await file.read()
        try:
            raw_text = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            raw_text = content_bytes.decode("latin-1", errors="replace")

        result = orchestrator.execute({
            "raw_content": raw_text,
            "file_name": file.filename or "uploaded_file.bin",
            "privacy_guard": privacy_guard,
            "self_healing": self_healing,
            "vernacular_mode": vernacular_mode,
            "target_dialect": "IN_ENTERPRISE"
        })

        return ParseResponse(
            success=True,
            source_file=file.filename or "uploaded_file.bin",
            total_records=len(result["final_records"]),
            records=result["final_records"],
            audit_trail=result["audit_trail"],
            reverse_schema=result["reverse_schema"] or reverse_schema_weapon.generate_schemas(),
            processing_time_ms=result["total_time_ms"],
            pipeline_stages_executed=result["pipeline_stages"],
            weapons_engaged=result["weapons_engaged"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File processing error: {str(e)}")

@app.post("/api/reverse-schema", response_model=ReverseSchemaOutput)
async def generate_reverse_schema(request: ReverseSchemaRequest):
    return reverse_schema_weapon.generate_schemas(table_name=request.table_name or "recast_enterprise_entities")
