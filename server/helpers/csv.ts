export function escapeCsvFormula(value: string): string {
  // Matches optional leading whitespace followed by =, +, -, or @
  const formulaRegex = /^\s*[=+\-@]/;
  if (formulaRegex.test(value)) {
    return `'${value}`;
  }
  return value;
}

export function escapeCsvField(val: any): string {
  if (val === null || val === undefined) {
    return '';
  }

  let strVal = '';
  if (Array.isArray(val)) {
    strVal = val.join(', ');
  } else {
    strVal = String(val);
  }

  // Escape formulas
  strVal = escapeCsvFormula(strVal);

  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  const needsQuotes = /[",\r\n]/.test(strVal);
  if (needsQuotes) {
    return `"${strVal.replace(/"/g, '""')}"`;
  }

  return strVal;
}

export function generateCsv(headers: string[], rows: any[][]): string {
  const headerLine = headers.map(escapeCsvField).join(',');
  const rowLines = rows.map((row) => row.map(escapeCsvField).join(','));
  // Use UTF-8 Byte Order Mark (BOM) to support Excel opening UTF-8 CSVs correctly
  return `\ufeff${[headerLine, ...rowLines].join('\r\n')}`;
}
