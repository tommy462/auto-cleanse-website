import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const csvPath = path.join(projectRoot, 'src/data/remap-data.csv');
const outputDir = path.join(projectRoot, 'public/data');
const outputPath = path.join(outputDir, 'remap-lookup.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function parseCSVLine(line) {
  const fields = [];
  let inQuote = false;
  let current = '';

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuote = !inQuote;
      }
    } else if (ch === ',' && !inQuote) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parsePythonList(str) {
  if (!str || str.trim() === '' || str.trim() === '[]') return [];
  const matches = str.match(/'([^']+)'/g);
  if (!matches) return [];
  return matches.map(m => m.replace(/^'|'$/g, '').trim()).filter(Boolean);
}

const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.trim());

const headers = parseCSVLine(lines[0]);
console.log('Headers:', headers.slice(0, 12).join(', '));

const result = { manufacturers: [] };
const manufacturerSet = new Set();
let rowsProcessed = 0;
let rowsSkipped = 0;

for (let i = 1; i < lines.length; i++) {
  const fields = parseCSVLine(lines[i]);
  if (fields.length < 7) { rowsSkipped++; continue; }

  const manufacturer = fields[0];
  const model = fields[1];
  const year = fields[2];
  const engine_dropdown = fields[3];
  const engine_name = fields[4];
  const stock_bhp = parseInt(fields[5]) || 0;
  const stage1_bhp = parseInt(fields[6]) || 0;
  const bhp_gain = parseInt(fields[7]) || 0;
  const stock_torque = parseInt(fields[8]) || 0;
  const stage1_torque = parseInt(fields[9]) || 0;
  const torque_gain = parseInt(fields[10]) || 0;
  const options_available = fields[11] || '';

  if (!manufacturer || !model || !year || !engine_dropdown) { rowsSkipped++; continue; }

  manufacturerSet.add(manufacturer);

  if (!result[manufacturer]) {
    result[manufacturer] = { models: [] };
  }

  if (!result[manufacturer][model]) {
    result[manufacturer].models.push(model);
    result[manufacturer][model] = { years: [] };
  }

  if (!result[manufacturer][model][year]) {
    result[manufacturer][model].years.push(year);
    result[manufacturer][model][year] = { engines: [] };
  }

  if (!result[manufacturer][model][year][engine_dropdown]) {
    result[manufacturer][model][year].engines.push(engine_dropdown);
    result[manufacturer][model][year][engine_dropdown] = {
      engine_name,
      stock_bhp,
      stage1_bhp,
      bhp_gain,
      stock_torque,
      stage1_torque,
      torque_gain,
      options: parsePythonList(options_available),
    };
    rowsProcessed++;
  }
}

result.manufacturers = Array.from(manufacturerSet).sort();

fs.writeFileSync(outputPath, JSON.stringify(result));

const sizeKB = Math.round(fs.statSync(outputPath).size / 1024);
console.log(`\nDone.`);
console.log(`  Manufacturers : ${result.manufacturers.length}`);
console.log(`  Rows processed: ${rowsProcessed}`);
console.log(`  Rows skipped  : ${rowsSkipped}`);
console.log(`  Output size   : ${sizeKB} KB`);
console.log(`  Written to    : ${outputPath}`);
