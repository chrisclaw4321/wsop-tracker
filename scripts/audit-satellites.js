#!/usr/bin/env node

/**
 * Satellite Audit Script
 * Checks satellite structure against actual DB format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../src/data/tournaments.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('='.repeat(80));
console.log('WSOP EUROPE PRAGUE 2026 - SATELLITE AUDIT');
console.log('='.repeat(80));
console.log('');

let issues = 0;

console.log('📊 SATELLITE STRUCTURE IN DATABASE:');
console.log('-'.repeat(80));

db.satellites.forEach((sat, index) => {
  console.log(`\n${index + 1}. [ID ${sat.id}] ${sat.name}`);
  console.log(`   Buy-in: €${sat.buyIn} + €${sat.rake} = €${sat.buyIn + sat.rake}`);
  console.log(`   Starting Stack: ${sat.startingStack} chips`);
  console.log(`   Blind Levels: ${sat.blindLevels.duration}-minute, starting at ${sat.blindLevels.startingBlinds}`);
  console.log(`   Feeds To: ${sat.feedsTo}`);
  console.log(`   Instances: ${sat.instances.length}`);
  
  sat.instances.forEach((inst, i) => {
    console.log(`     ${i + 1}. ${inst.date} @ ${inst.time} (${inst.seatsGtd} seats GTD)`);
  });

  // Validate required fields
  if (!sat.name) { console.log('   ❌ Missing name'); issues++; }
  if (sat.buyIn === undefined) { console.log('   ❌ Missing buyIn'); issues++; }
  if (!sat.feedsTo) { console.log('   ❌ Missing feedsTo'); issues++; }
  if (!sat.instances || sat.instances.length === 0) { console.log('   ❌ Missing instances'); issues++; }
  if (!sat.blindLevels) { console.log('   ❌ Missing blindLevels'); issues++; }
  if (!sat.startingStack) { console.log('   ❌ Missing startingStack'); issues++; }

  // Check for duplicate instances
  const instanceKeys = sat.instances.map(i => `${i.date}-${i.time}`);
  const uniqueKeys = new Set(instanceKeys);
  if (uniqueKeys.size !== instanceKeys.length) {
    console.log('   ❌ Duplicate instances detected!');
    issues++;
  }
});

// Check for duplicate satellite IDs
const satIds = db.satellites.map(s => s.id);
const uniqueSatIds = new Set(satIds);
if (uniqueSatIds.size !== satIds.length) {
  console.log('\n❌ Duplicate satellite IDs detected!');
  issues++;
} else {
  console.log('\n✅ All satellite IDs are unique');
}

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`\nTotal satellites: ${db.satellites.length}`);
console.log(`Total instances: ${db.satellites.reduce((sum, s) => sum + s.instances.length, 0)}`);
console.log(`Issues found: ${issues}`);

if (issues === 0) {
  console.log('\n✅ SATELLITE AUDIT PASSED');
} else {
  console.log(`\n❌ SATELLITE AUDIT FAILED - ${issues} issues found`);
}
