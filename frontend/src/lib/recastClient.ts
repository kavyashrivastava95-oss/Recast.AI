import { ParseResponse, ReverseSchemaOutput } from "./types";

export interface ParseOptions {
  raw_content: string;
  file_name?: string;
  privacy_guard?: boolean;
  self_healing?: boolean;
  vernacular_mode?: boolean;
}

export async function parseLegacyData(options: ParseOptions): Promise<ParseResponse> {
  const res = await fetch("/api/recast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw_content: options.raw_content,
      file_name: options.file_name || "legacy_input.txt",
      privacy_guard: options.privacy_guard ?? true,
      self_healing: options.self_healing ?? true,
      vernacular_mode: options.vernacular_mode ?? true,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Migration Agent Error: ${res.statusText}`);
  }

  return res.json();
}
