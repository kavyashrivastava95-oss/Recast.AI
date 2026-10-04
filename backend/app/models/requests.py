from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from .schema import CleanEnterpriseRecord11Col, AuditStep, ReverseSchemaOutput

class ParseRequest(BaseModel):
    raw_content: str = Field(..., description="Messy legacy text, multi-line addresses, CSV rows, or OCR snippet")
    file_name: Optional[str] = Field("manual_input.txt", description="Source filename or uploaded identifier")
    privacy_guard: bool = Field(True, description="Enable GDPR PII Token Masking before LLM")
    self_healing: bool = Field(True, description="Enable Zero-Shot Self-Healing for missing fields")
    vernacular_mode: bool = Field(True, description="Enable Vernacular / Hinglish Address Parser")
    target_dialect: Optional[str] = Field("IN_ENTERPRISE", description="Target region/dialect schema")

class ParseResponse(BaseModel):
    success: bool
    source_file: str
    total_records: int
    records: List[CleanEnterpriseRecord11Col]
    audit_trail: List[AuditStep]
    reverse_schema: ReverseSchemaOutput
    processing_time_ms: float
    pipeline_stages_executed: List[str]
    weapons_engaged: List[str]

class ReverseSchemaRequest(BaseModel):
    table_name: Optional[str] = "recast_enterprise_entities"
    include_indexes: bool = True
    include_constraints: bool = True

class SampleDatasetItem(BaseModel):
    id: str
    title: str
    category: str
    description: str
    raw_content: str
