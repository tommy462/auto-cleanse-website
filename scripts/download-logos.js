#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.join(__dirname, '../public/logos/manufacturers');

// Map of manufacturer names to Wikimedia Commons logos
const MANUFACTURERS = {
  'Acura': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Acura_logo.svg/1200px-Acura_logo.svg.png',
  'Alfa Romeo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Alfa_Romeo_logo.svg/1200px-Alfa_Romeo_logo.svg.png',
  'Alpina': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Alpina_logo.svg/1200px-Alpina_logo.svg.png',
  'Alpine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Alpine_Cars_logo.svg/1200px-Alpine_Cars_logo.svg.png',
  'Aston Martin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Aston_Martin_logo.svg/1200px-Aston_Martin_logo.svg.png',
  'Audi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Audi_logo.svg/1200px-Audi_logo.svg.png',
  'Bentley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Bentley_logo.svg/1200px-Bentley_logo.svg.png',
  'BMW': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png',
  'Bugatti': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Bugatti_logo.svg/1200px-Bugatti_logo.svg.png',
  'Cadillac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cadillac_Emblem.svg/1200px-Cadillac_Emblem.svg.png',
  'Chevrolet': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Chevrolet_logo.svg/1200px-Chevrolet_logo.svg.png',
  'Chrysler': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Chrysler_logo.svg/1200px-Chrysler_logo.svg.png',
  'Citroën': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Citro%C3%ABn_logo_2009.svg/1200px-Citro%C3%ABn_logo_2009.svg.png',
  'Cupra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Cupra_logo.svg/1200px-Cupra_logo.svg.png',
  'Dacia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dacia_Logo.svg/1200px-Dacia_Logo.svg.png',
  'Daewoo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Daewoo_logo.svg/1200px-Daewoo_logo.svg.png',
  'Dallara': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Dallara_Logo.svg/1200px-Dallara_Logo.svg.png',
  'DS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/DS_logo.svg/1200px-DS_logo.svg.png',
  'Dodge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Dodge_logo.svg/1200px-Dodge_logo.svg.png',
  'Ferrari': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Ferrari_logo.svg/1200px-Ferrari_logo.svg.png',
  'Fiat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Fiat_logo.svg/1200px-Fiat_logo.svg.png',
  'Ford': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Ford_logo.svg/1200px-Ford_logo.svg.png',
  'Genesis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Genesis_car_brand_logo.svg/1200px-Genesis_car_brand_logo.svg.png',
  'GMC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/GMC_logo.svg/1200px-GMC_logo.svg.png',
  'GWM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Great_Wall_Motor_logo.svg/1200px-Great_Wall_Motor_logo.svg.png',
  'Geely': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Geely_logo.svg/1200px-Geely_logo.svg.png',
  'Holden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Holden_logo.svg/1200px-Holden_logo.svg.png',
  'Honda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Honda_logo.svg/1200px-Honda_logo.svg.png',
  'Hummer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hummer_logo.svg/1200px-Hummer_logo.svg.png',
  'Hyundai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Hyundai_logo_%282004%29.svg/1200px-Hyundai_logo_%282004%29.svg.png',
  'Infiniti': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Infiniti_logo.svg/1200px-Infiniti_logo.svg.png',
  'Isuzu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Isuzu_logo.svg/1200px-Isuzu_logo.svg.png',
  'Iveco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Iveco_logo.svg/1200px-Iveco_logo.svg.png',
  'Jaguar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Jaguar_logo.svg/1200px-Jaguar_logo.svg.png',
  'Jeep': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Jeep_logo.svg/1200px-Jeep_logo.svg.png',
  'Kia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Kia_Motors_logo.svg/1200px-Kia_Motors_logo.svg.png',
  'KTM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/KTM_ag.svg/1200px-KTM_ag.svg.png',
  'LDV': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/LDV_logo.svg/1200px-LDV_logo.svg.png',
  'Lamborghini': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Lamborghini_Logo.svg/1200px-Lamborghini_Logo.svg.png',
  'Lancia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Lancia_logo.svg/1200px-Lancia_logo.svg.png',
  'Land Rover': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Land_Rover_logo.svg/1200px-Land_Rover_logo.svg.png',
  'Lexus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Lexus_logo.svg/1200px-Lexus_logo.svg.png',
  'Lincoln': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Lincoln_logo.svg/1200px-Lincoln_logo.svg.png',
  'Lotus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Lotus_Cars_logo.svg/1200px-Lotus_Cars_logo.svg.png',
  'Luxgen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Luxgen_logo.svg/1200px-Luxgen_logo.svg.png',
  'MAN': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/MAN_logo.svg/1200px-MAN_logo.svg.png',
  'MG': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/MG_Motor_UK_Logo.svg/1200px-MG_Motor_UK_Logo.svg.png',
  'Mahindra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Mahindra_&_Mahindra_Limited_Logo.svg/1200px-Mahindra_&_Mahindra_Limited_Logo.svg.png',
  'Maserati': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Maserati_logo.svg/1200px-Maserati_logo.svg.png',
  'Mazda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Mazda_logo.svg/1200px-Mazda_logo.svg.png',
  'McLaren': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/McLaren_logo.svg/1200px-McLaren_logo.svg.png',
  'Mercedes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Mercedes_Benz_logo.svg/1200px-Mercedes_Benz_logo.svg.png',
  'Mercury': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Mercury_logo.svg/1200px-Mercury_logo.svg.png',
  'Mini': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/MINI_logo.svg/1200px-MINI_logo.svg.png',
  'Mitsubishi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Mitsubishi_logo.svg/1200px-Mitsubishi_logo.svg.png',
  'Nissan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Nissan_logo.svg/1200px-Nissan_logo.svg.png',
  'Opel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Opel_logo.svg/1200px-Opel_logo.svg.png',
  'Pagani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pagani_logo.svg/1200px-Pagani_logo.svg.png',
  'Peugeot': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Peugeot_logo.svg/1200px-Peugeot_logo.svg.png',
  'Piaggio': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Piaggio_Logo.svg/1200px-Piaggio_Logo.svg.png',
  'Pontiac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Pontiac_logo.svg/1200px-Pontiac_logo.svg.png',
  'Porsche': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Porsche_logo.svg/1200px-Porsche_logo.svg.png',
  'Renault': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Renault_logo.svg/1200px-Renault_logo.svg.png',
  'Rolls Royce': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Rolls-Royce_logo.svg/1200px-Rolls-Royce_logo.svg.png',
  'Rover': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Rover_logo.svg/1200px-Rover_logo.svg.png',
  'Saab': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Saab_logo.svg/1200px-Saab_logo.svg.png',
  'Saturn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Saturn_logo.svg/1200px-Saturn_logo.svg.png',
  'SEAT': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/SEAT_logo.svg/1200px-SEAT_logo.svg.png',
  'Seat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/SEAT_logo.svg/1200px-SEAT_logo.svg.png',
  'Škoda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/%C5%A0koda_logo.svg/1200px-%C5%A0koda_logo.svg.png',
  'Skoda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/%C5%A0koda_logo.svg/1200px-%C5%A0koda_logo.svg.png',
  'Smart': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Smart_Logo.svg/1200px-Smart_Logo.svg.png',
  'SsangYong': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/SsangYong_logo.svg/1200px-SsangYong_logo.svg.png',
  'Subaru': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Subaru_logo.svg/1200px-Subaru_logo.svg.png',
  'Suzuki': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Suzuki_Motor_logo.svg/1200px-Suzuki_Motor_logo.svg.png',
  'Tesla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Tesla_logo.svg/1200px-Tesla_logo.svg.png',
  'Toyota': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Toyota_logo.svg/1200px-Toyota_logo.svg.png',
  'Triumph': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Triumph_logo.svg/1200px-Triumph_logo.svg.png',
  'Vauxhall': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Vauxhall_logo.svg/1200px-Vauxhall_logo.svg.png',
  'Volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/1200px-Volkswagen_logo_2019.svg.png',
  'Volvo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Volvo_logo.svg/1200px-Volvo_logo.svg.png',
};

// Ensure directory exists
if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
  console.log(`Created directory: ${LOGOS_DIR}`);
}

// Download a file with proper headers
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(LOGOS_DIR, filename);
    const file = fs.createWriteStream(filepath);

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    };

    https
      .get(url, options, (response) => {
        // Follow redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307 || response.statusCode === 308) {
          file.close();
          fs.unlink(filepath, () => {});
          return downloadFile(response.headers.location, filename).then(resolve).catch(reject);
        }

        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${filename}`);
            resolve();
          });
        } else {
          file.close();
          fs.unlink(filepath, () => {});
          console.log(`✗ Failed (${response.statusCode}): ${filename}`);
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      })
      .on('error', (err) => {
        file.close();
        fs.unlink(filepath, () => {});
        console.log(`✗ Error: ${filename} - ${err.message}`);
        reject(err);
      });
  });
}

// Convert manufacturer name to filename
function getFilename(make) {
  return make
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

// Download all logos
async function downloadAllLogos() {
  const manufacturers = Object.keys(MANUFACTURERS);
  const failed = [];
  const succeeded = [];

  console.log(`\nDownloading ${manufacturers.length} manufacturer logos...\n`);

  for (const make of manufacturers) {
    const url = MANUFACTURERS[make];
    const filename = getFilename(make) + '.png';

    try {
      await downloadFile(url, filename);
      succeeded.push(make);
    } catch (err) {
      failed.push(make);
    }

    // Rate limiting - wait 300ms between requests
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Downloaded: ${succeeded.length}/${manufacturers.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log(`\nFailed manufacturers (will use letter avatars):`);
    failed.forEach(make => console.log(`  - ${make}`));
  }

  console.log(`${'='.repeat(50)}\n`);
}

downloadAllLogos().catch(console.error);
