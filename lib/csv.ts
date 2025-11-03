/**
 * CSV parsing and loading utilities
 * Uses native JavaScript parsing (built-in) for robustness
 */

export interface CSVData {
  headers: string[];
  rows: Record<string, string | number>[];
}

/**
 * Parse CSV string to data object
 * Simple, reliable parser that handles quoted fields
 */
export function parseCSV(csvString: string): CSVData {
  const lines = csvString.trim().split('\n');

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);

  // Parse data rows
  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string | number> = {};

    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Try to convert to number if it looks like a number
      row[header] =
        !isNaN(Number(value)) && value !== '' ? Number(value) : value;
    });

    return row;
  });

  return { headers, rows };
}

/**
 * Parse a single CSV line, handling quoted fields with commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Fetch and parse CSV file
 */
export async function loadCSV(filePath: string): Promise<CSVData> {
  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch CSV: ${response.status} ${response.statusText}`
      );
    }

    const csvString = await response.text();
    return parseCSV(csvString);
  } catch (error) {
    console.error(`Error loading CSV from ${filePath}:`, error);
    throw new Error(`Failed to load CSV: ${filePath}`);
  }
}

/**
 * Select specific columns from CSV data
 */
export function selectColumns(
  data: CSVData,
  columnNames: string[]
): Record<string, (string | number)[]> {
  const result: Record<string, (string | number)[]> = {};

  columnNames.forEach((columnName) => {
    result[columnName] = data.rows.map((row) => row[columnName]);
  });

  return result;
}

/**
 * Filter CSV rows by predicate
 */
export function filterRows(
  data: CSVData,
  predicate: (row: Record<string, string | number>) => boolean
): CSVData {
  return {
    headers: data.headers,
    rows: data.rows.filter(predicate),
  };
}
