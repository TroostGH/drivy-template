// seed.js — versione "template" (SENZA dati personali).
// L'app parte vuota: aggiungi il tuo veicolo dal Garage, oppure importa un
// export CSV di Drivvo dalle Impostazioni (il parser qui sotto serve a quello).

// Mappa i tipi Drivvo (inglese/misti) -> sotto-tipi Manutenzione in italiano
const SUBTYPE_MAP = {
  'Rotate Tires': 'Rotazione gomme',
  'Tagliando': 'Tagliando',
  'Inspection': 'Ispezione',
  'Windshield Wipers': 'Tergicristalli',
  'Battery': 'Batteria',
  'New Tires': 'Nuove gomme',
  'Ad Blue': 'AdBlue',
  'Assicurazione': 'Assicurazione',
  'Digital Services': 'Accessori',
  'Revisione': 'Revisione',
  'Tolls': 'Pedaggi',
  'Tax': 'Bollo',
  'Car Wash': 'Autolavaggio',
  'Fix': 'Riparazione',
};

function parseCsvLine(line) {
  const out = []; let cur = ''; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false; }
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur); return out;
}
const num = (s) => { if (s == null) return 0; const v = parseFloat(String(s).replace(',', '.')); return Number.isFinite(v) ? v : 0; };
const toIso = (s) => (s || '').trim().replace(' ', 'T');

// Converte una stringa CSV esportata da Drivvo in record Drivy per un dato vehicleId
export function parseDrivvo(csv, vehicleId) {
  const lines = csv.split(/\r?\n/);
  const entries = [];
  let section = null, seenHeader = false, counter = 0;
  const mkId = (d) => `seed_${vehicleId}_${(d || '').replace(/[^0-9]/g, '')}_${counter++}`;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('##')) { section = line.slice(2).trim().toLowerCase(); seenHeader = false; continue; }
    if (!seenHeader) { seenHeader = true; continue; }
    const f = parseCsvLine(line);
    if (section === 'refuelling') {
      entries.push({
        id: mkId(f[1]), vehicleId, type: 'fuel', date: toIso(f[1]),
        odometer: num(f[0]), cost: num(f[4]), liters: num(f[5]), pricePerLiter: num(f[3]),
        fullTank: (f[6] || '').trim() === 'Sì', fuelType: (f[2] || 'Diesel').trim(),
        station: (f[19] || '').trim(), note: (f[23] || '').trim(),
      });
    } else if (section === 'expense') {
      const dtype = (f[3] || '').trim();
      entries.push({ id: mkId(f[1]), vehicleId, type: 'maintenance', date: toIso(f[1]),
        odometer: num(f[0]), cost: num(f[2]), subtype: SUBTYPE_MAP[dtype] || dtype || 'Altro', note: (f[8] || '').trim() });
    } else if (section === 'service') {
      const dtype = (f[3] || '').trim();
      entries.push({ id: mkId(f[1]), vehicleId, type: 'maintenance', date: toIso(f[1]),
        odometer: num(f[0]), cost: num(f[2]), subtype: SUBTYPE_MAP[dtype] || dtype || 'Altro', note: (f[7] || '').trim() });
    }
  }
  entries.sort((a, b) => (a.date < b.date ? 1 : -1));
  return entries;
}

// Nessun veicolo/movimento precaricato in questa versione "template".
export function buildSeed() { return null; }
