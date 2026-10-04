import { CleanEnterpriseRecord11Col } from "./types";

/**
 * Escapes XML entities for Microsoft Excel SpreadsheetML
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Exports records as a fully formatted Microsoft Excel Spreadsheet (.xls / XML Spreadsheet 2003)
 * Opens natively in Microsoft Excel, Google Sheets, LibreOffice, and Numbers with styled headers,
 * proper column widths, and the standardized 11 enterprise columns.
 */
export function exportToExcel(
  records: CleanEnterpriseRecord11Col[],
  filename = "recast_11col_clean_records.xls"
): void {
  if (!records.length) return;

  const columns = [
    { key: "record_id", label: "Record ID", width: 140 },
    { key: "entity_type", label: "Entity Type", width: 100 },
    { key: "full_name_clean", label: "Clean Entity Name", width: 180 },
    { key: "tax_id", label: "Tax ID (GSTIN/PAN)", width: 130 },
    { key: "address_line1", label: "Address Line 1", width: 220 },
    { key: "address_line2", label: "Address Line 2", width: 180 },
    { key: "city", label: "City", width: 110 },
    { key: "state_province", label: "State / Province", width: 120 },
    { key: "postal_code", label: "Postal Code", width: 90 },
    { key: "contact_normalized", label: "Contact (E.164)", width: 150 },
    { key: "confidence_score", label: "Confidence Score", width: 110 },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Recast Standardized 11-Column Schema</Title>
  <Subject>Enterprise Clean Data Export</Subject>
  <Author>Recast AI</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#1C1917" ss:FontName="Segoe UI" ss:Size="10"/>
   <Interior ss:Color="#F5F2EB" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D6D3D1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D6D3D1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E7E5E4"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E7E5E4"/>
   </Borders>
  </Style>
  <Style ss:ID="Data">
   <Font ss:Color="#1C1917" ss:FontName="Segoe UI" ss:Size="10"/>
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F5F5F4"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F5F5F4"/>
   </Borders>
  </Style>
  <Style ss:ID="DataEven">
   <Font ss:Color="#1C1917" ss:FontName="Segoe UI" ss:Size="10"/>
   <Interior ss:Color="#FDFBF7" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F5F5F4"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F5F5F4"/>
   </Borders>
  </Style>
  <Style ss:ID="Confidence">
   <Font ss:Bold="1" ss:Color="#15803D" ss:FontName="Segoe UI" ss:Size="10"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="0.0%"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F5F5F4"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F5F5F4"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="11_Column_Enterprise_Schema">
  <Table ss:DefaultRowHeight="20">
`;

  // Define column widths
  for (const col of columns) {
    xml += `   <Column ss:Width="${col.width}"/>\n`;
  }

  // Header Row
  xml += `   <Row ss:Height="24">\n`;
  for (const col of columns) {
    xml += `    <Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(col.label)}</Data></Cell>\n`;
  }
  xml += `   </Row>\n`;

  // Data Rows
  records.forEach((r, idx) => {
    const styleId = idx % 2 === 0 ? "Data" : "DataEven";
    xml += `   <Row ss:Height="20">\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.record_id)}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.entity_type)}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.full_name_clean)}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.tax_id)}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.address_line1)}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.address_line2)}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.city)}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.state_province.replace(" [HEALED]", ""))} ${r.state_province.includes("[HEALED]") ? "(Healed)" : ""}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.postal_code.replace(" [HEALED]", ""))} ${r.postal_code.includes("[HEALED]") ? "(Healed)" : ""}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(r.contact_normalized.replace(" [HEALED]", ""))}</Data></Cell>\n`;
    xml += `    <Cell ss:StyleID="Confidence"><Data ss:Type="Number">${r.confidence_score}</Data></Cell>\n`;
    xml += `   </Row>\n`;
  });

  xml += `  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports clean CSV with UTF-8 BOM for immediate Excel compatibility
 */
export function exportToCsv(
  records: CleanEnterpriseRecord11Col[],
  filename = "recast_clean_11col_records.csv"
): void {
  if (!records.length) return;
  const headers = [
    "record_id",
    "entity_type",
    "full_name_clean",
    "tax_id",
    "address_line1",
    "address_line2",
    "city",
    "state_province",
    "postal_code",
    "contact_normalized",
    "confidence_score",
  ];
  const rows = records.map((r) =>
    headers
      .map((h) => {
        const val = String((r as unknown as Record<string, unknown>)[h] ?? "");
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  // Prepend UTF-8 BOM so Excel opens non-ASCII and commas flawlessly
  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports JSON formatted records
 */
export function exportToJson(
  records: CleanEnterpriseRecord11Col[],
  filename = "recast_clean_11col_records.json"
): void {
  if (!records.length) return;
  const blob = new Blob([JSON.stringify(records, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
