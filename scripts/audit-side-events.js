#!/usr/bin/env node

/**
 * Side Events Audit Script
 * Checks side event structure against actual DB format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../src/data/tournaments.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('='.repeat(80));
console.log('WSOP EUROPE PRAGUE 2026 - SIDE EVENTS AUDIT');
console.log('='.repeat(80));
console.log('');

let issues = 0;

console.log('📊 SIDE EVENTS STRUCTURE IN DATABASE:');
console.log('-'.repeat(80));

db.sideEvents.forEach((side, index) => {
  console.log(`\n${index + 1}. [ID ${side.id}] ${side.name}`);
  console.log(`   Buy-in: €${side.buyIn} + €${side.rake} = €${side.buyIn + side.rake}`);
  console.log(`   Starting Stack: ${side.startingStack} chips`);
  console.log(`   Blind Levels: ${side.blindLevels.duration}-minute, starting at ${side.blindLevels.startingBlinds}`);
  console.log(`   Instances: ${side.instances.length}`);
  
  side.instances.forEach((inst, i) => {
    console.log(`     ${i + 1}. ${inst.date} @ ${inst.time}${inst.note ? ' (' + inst.note + ')' : ''}`);
  });

  // Validate required fields
  if (!side.name) { console.log('   ❌ Missing name'); issues++; }
  if (side.buyIn === undefined) { console.log('   ❌ Missing buyIn'); issues++; }
  if (!side.instances || side.instances.length === 0) { console.log('   ❌ Missing instances'); issues++; }
  if (!side.blindLevels) { console.log('   ❌ Missing blindLevels'); issues++; }

  // Check for buy-in = 0 without note
  if (side.buyIn === 0 && !side.buyInNote) {
    console.log('   ⚠️  Buy-in is €0 without explanation');
    issues++;
  }

  // Check for duplicate instances
  const instanceKeys = side.instances.map(i => `${i.date}-${i.time}`);
  const uniqueKeys = new Set(instanceKeys);
  if (uniqueKeys.size !== instanceKeys.length) {
    console.log('   ❌ Duplicate instances detected!');
    issues++;
  }
});

// Check for duplicate side event IDs
const sideIds = db.sideEvents.map(s => s.id);
const uniqueSideIds = new Set(sideIds);
if (uniqueSideIds.size !== sideIds.length) {
  console.log('\n❌ Duplicate side event IDs detected!');
  issues++;
} else {
  console.log('\n✅ All side event IDs are unique');
}

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`\nTotal side events: ${db.sideEvents.length}`);
console.log(`Total instances: ${db.sideEvents.reduce((sum, s) => sum + s.instances.length, 0)}`);
console.log(`Issues found: ${issues}`);

if (issues === 0) {
  console.log('\n✅ SIDE EVENTS AUDIT PASSED');
} else {
  console.log(`\n❌ SIDE EVENTS AUDIT FAILED - ${issues} issues found`);
}
