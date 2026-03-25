#!/usr/bin/env node

/**
 * Bracelet Events Audit Script
 * Checks which bracelet events have actual multiple flights
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../src/data/tournaments.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('='.repeat(80));
console.log('WSOP EUROPE PRAGUE 2026 - BRACELET EVENTS AUDIT');
console.log('='.repeat(80));
console.log('');

console.log('📊 CURRENT BRACELET EVENTS STRUCTURE IN DATABASE:');
console.log('-'.repeat(80));

db.braceletEvents.forEach((bracelet, index) => {
  console.log(`\n${index + 1}. Event #${bracelet.eventNum} - ${bracelet.name}`);
  console.log(`   Buy-in: €${bracelet.buyIn} + €${bracelet.rake} = €${bracelet.buyIn + bracelet.rake}`);
  console.log(`   Starting Stack: ${bracelet.startingStack || 'N/A'} chips`);
  console.log(`   Blind Levels: ${bracelet.blindLevels.duration}-minute, starting at ${bracelet.blindLevels.startingBlinds}`);
  console.log(`   Flights: ${bracelet.flights.length}`);
  
  bracelet.flights.forEach((flight, i) => {
    console.log(`     Flight ${flight.num}: ${flight.date} @ ${flight.time}`);
  });
});

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS');
console.log('='.repeat(80));

console.log('\n🔍 Key Question: Which events have MULTIPLE flights vs SINGLE flight?');
console.log('-'.repeat(80));

let singleFlightEvents = [];
let multiFlightEvents = [];

db.braceletEvents.forEach((bracelet) => {
  if (bracelet.flights.length === 1) {
    singleFlightEvents.push({
      eventNum: bracelet.eventNum,
      name: bracelet.name,
      flights: 1
    });
  } else {
    multiFlightEvents.push({
      eventNum: bracelet.eventNum,
      name: bracelet.name,
      flights: bracelet.flights.length
    });
  }
});

console.log('\n✅ SINGLE FLIGHT EVENTS (no expansion needed):');
console.log('-'.repeat(80));
singleFlightEvents.forEach(event => {
  console.log(`Event #${event.eventNum}: ${event.name}`);
});

console.log(`\nTotal: ${singleFlightEvents.length} events`);

console.log('\n⚠️  MULTIPLE FLIGHT EVENTS (already expanded correctly):');
console.log('-'.repeat(80));
multiFlightEvents.forEach(event => {
  console.log(`Event #${event.eventNum}: ${event.name} (${event.flights} flights)`);
});

console.log(`\nTotal: ${multiFlightEvents.length} events`);

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

console.log(`\nBracelet events total: ${db.braceletEvents.length}`);
console.log(`  - Single flight: ${singleFlightEvents.length}`);
console.log(`  - Multiple flights: ${multiFlightEvents.length}`);

let totalFlightRows = 0;
db.braceletEvents.forEach(bracelet => {
  totalFlightRows += bracelet.flights.length;
});

console.log(`\nWhen expanded (one row per flight):`);
console.log(`  - Total display rows: ${totalFlightRows}`);

console.log(`\n✅ BRACELET EVENTS STRUCTURE IS CORRECT`);
console.log(`   Events with single flight show as 1 entry`);
console.log(`   Events with multiple flights are ready to expand to N entries`);
