export type EntityClassification = 'INDIVIDUAL' | 'ENTERPRISE' | 'VENDOR' | 'LOGISTICS_HUB';

export interface CleanEnterpriseRecord11Col {
  /** 1. Unique deterministic enterprise ID (REC-XXXX-XXXX) */
  record_id: string;

  /** 2. Classified entity category */
  entity_type: EntityClassification;

  /** 3. Normalized Title-Cased Name */
  full_name_clean: string;

  /** 4. Validated PAN, GSTIN, TIN, or Tax ID */
  tax_id: string;

  /** 5. Premise, House, Plot, Building, Street, Gali */
  address_line1: string;

  /** 6. Locality, Sector, Landmark, Mohalla */
  address_line2: string;

  /** 7. Normalized City / Municipal Region */
  city: string;

  /** 8. Standardized State / Province */
  state_province: string;

  /** 9. Validated 6-digit PIN / Postal code (Self-Healed if missing) */
  postal_code: string;

  /** 10. E.164 phone (+91...) and sanitized email address */
  contact_normalized: string;

  /** 11. Multimodal AI confidence rating (0.00 to 1.00) */
  confidence_score: number;

  /** Enterprise metadata */
  self_healed_fields?: string[];
  pii_masked_map?: Record<string, string>;
  vernacular_terms_resolved?: string[];
  raw_source_snippet?: string;
  record_hash?: string;
}

export interface AuditStep {
  step_index: number;
  stage: string;
  actor: string;
  status: string;
  timestamp: string;
  input_hash: string;
  output_hash: string;
  details: string;
  latency_ms: number;
}

export interface ReverseSchemaOutput {
  sql_ddl: string;
  prisma_schema: string;
  pydantic_model: string;
  typescript_interface: string;
  json_schema: string;
}

export interface ParseResponse {
  success: boolean;
  source_file: string;
  total_records: number;
  records: CleanEnterpriseRecord11Col[];
  audit_trail: AuditStep[];
  reverse_schema: ReverseSchemaOutput;
  processing_time_ms: number;
  pipeline_stages_executed: string[];
  weapons_engaged: string[];
}

export interface EnterpriseSample {
  id: string;
  title: string;
  category: string;
  description: string;
  raw_content: string;
  badge?: string;
}
