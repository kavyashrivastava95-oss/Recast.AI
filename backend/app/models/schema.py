from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class CleanEnterpriseRecord11Col(BaseModel):
    """
    Standard 11-Column Enterprise Migration Schema
    Standardized destination structure for legacy enterprise databases.
    """
    # 1. Unique Deterministic Enterprise Identifier
    record_id: str = Field(
        ...,
        description="Unique deterministic enterprise identifier, e.g. REC-2026-4F1A"
    )
    
    # 2. Classified Entity Type
    entity_type: str = Field(
        ...,
        description="Classified entity type: INDIVIDUAL | ENTERPRISE | VENDOR | LOGISTICS_HUB"
    )
    
    # 3. Clean Normalized Corporate / Individual Name
    full_name_clean: str = Field(
        ...,
        description="Sanitized, title-cased entity name stripped of legacy noise"
    )
    
    # 4. Normalized Tax Identification (PAN / GSTIN / TIN / EIN)
    tax_id: str = Field(
        ...,
        description="Validated PAN, GSTIN, TIN, or enterprise tax identifier (or NOT_PROVIDED)"
    )
    
    # 5. Address Line 1 (Premise, House, Plot, Building, Street, Gali)
    address_line1: str = Field(
        ...,
        description="Primary premise info: Door, building, street, or gali name"
    )
    
    # 6. Address Line 2 (Locality, Sector, Landmark, Mohalla)
    address_line2: str = Field(
        ...,
        description="Secondary locality info: Sector, phase, landmark, mohalla"
    )
    
    # 7. Normalized City / Municipal Region
    city: str = Field(
        ...,
        description="Normalized official city or town name"
    )
    
    # 8. Normalized State / Province
    state_province: str = Field(
        ...,
        description="Standardized state or province"
    )
    
    # 9. Validated Postal / PIN Code (Self-Healed if missing)
    postal_code: str = Field(
        ...,
        description="Standard 6-digit PIN / postal code (auto-predicted if missing)"
    )
    
    # 10. Normalized E.164 Contact / Email
    contact_normalized: str = Field(
        ...,
        description="E.164 phone (+91...) and sanitized email address"
    )
    
    # 11. Multimodal AI Confidence Score
    confidence_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Composite AI parse & healing confidence score between 0.0 and 1.0"
    )

    # Enterprise Metadata & Audit Lineage
    self_healed_fields: List[str] = Field(
        default_factory=list,
        description="List of fields autonomously inferred or self-healed"
    )
    pii_masked_map: Dict[str, str] = Field(
        default_factory=dict,
        description="Cryptographic token to raw value mapping (held in secure memory)"
    )
    vernacular_terms_resolved: List[str] = Field(
        default_factory=list,
        description="Vernacular, Hinglish, or slang terms normalized"
    )
    raw_source_snippet: str = Field(
        default="",
        description="Original messy legacy input snippet"
    )
    record_hash: str = Field(
        default="",
        description="SHA-256 cryptographic hash of the parsed output"
    )


class AuditStep(BaseModel):
    step_index: int
    stage: str
    actor: str
    status: str
    timestamp: str
    input_hash: str
    output_hash: str
    details: str
    latency_ms: float


class ReverseSchemaOutput(BaseModel):
    sql_ddl: str
    prisma_schema: str
    pydantic_model: str
    typescript_interface: str
    json_schema: str
