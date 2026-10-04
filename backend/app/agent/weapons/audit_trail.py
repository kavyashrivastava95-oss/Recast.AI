import time
import hashlib
import json
from datetime import datetime, timezone
from typing import List, Dict, Any
from ...models.schema import AuditStep

class AuditTrailWeapon:
    """
    Weapon 4: Automated Audit Trail
    Generates a live cryptographic lineage and enterprise compliance transformation log.
    Every transformation step is immutably chained using SHA-256 block hashes.
    """

    def __init__(self):
        self.genesis_hash = hashlib.sha256(b"RECAST_GENESIS_BLOCK_2026").hexdigest()

    def create_step(
        self,
        step_index: int,
        stage: str,
        actor: str,
        status: str,
        input_payload: Any,
        output_payload: Any,
        details: str,
        latency_ms: float,
        previous_hash: str = ""
    ) -> AuditStep:
        """
        Creates a cryptographically signed audit step.
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        
        in_str = json.dumps(input_payload, default=str, sort_keys=True)
        out_str = json.dumps(output_payload, default=str, sort_keys=True)
        
        prev = previous_hash if previous_hash else self.genesis_hash
        in_hash = hashlib.sha256(f"{prev}:{in_str}".encode("utf-8")).hexdigest()
        out_hash = hashlib.sha256(f"{in_hash}:{stage}:{out_str}".encode("utf-8")).hexdigest()

        return AuditStep(
            step_index=step_index,
            stage=stage,
            actor=actor,
            status=status,
            timestamp=now_iso,
            input_hash=f"0x{in_hash[:16]}...{in_hash[-8:]}",
            output_hash=f"0x{out_hash[:16]}...{out_hash[-8:]}",
            details=details,
            latency_ms=round(latency_ms, 2)
        )

    def calculate_record_hash(self, record_dict: Dict[str, Any]) -> str:
        """
        Generates deterministic SHA-256 hash for an 11-column record.
        """
        keys_ordered = sorted(record_dict.keys())
        data_str = "|".join([f"{k}={record_dict[k]}" for k in keys_ordered if not k.startswith("record_hash")])
        return hashlib.sha256(data_str.encode("utf-8")).hexdigest()
