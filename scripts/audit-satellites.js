#!/usr/bin/env node

/**
 * Satellite Audit Script
 * Checks satellite structure and actual schedule variations
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

console.log('📊 CURRENT SATELLITE STRUCTURE IN DATABASE:');
console.log('-'.repeat(80));

db.satellites.forEach((sat, index) => {
  console.log(`\n${index + 1}. ${sat.satNum} - ${sat.name}`);
  console.log(`   Buy-in: €${sat.buyIn} + €${sat.rake} = €${sat.buyIn + sat.rake}`);
  console.log(`   Starting Stack: ${sat.startingStack} chips`);
  console.log(`   Blind Levels: ${sat.blindLevels.duration}-minute, starting at ${sat.blindLevels.startingBlinds}`);
  console.log(`   Feeds To: ${sat.feedsTo}`);
  console.log(`   Schedule:`);
  
  sat.schedule.forEach((sched, i) => {
    console.log(`     ${i + 1}. Time: ${sched.time}`);
    console.log(`        Runs: ${sched.runsDates}`);
  });
  
  console.log(`   Total schedule entries: ${sat.schedule.length}`);
});

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS');
console.log('='.repeat(80));

console.log('\n🔍 Key Question: Do satellites have DIFFERENT start times?');
console.log('-'.repeat(80));

db.satellites.forEach((sat) => {
  const times = sat.schedule.map(s => s.time);
  const uniqueTimes = new Set(times);
  
  console.log(`\n${sat.satNum}: ${sat.name}`);
  console.log(`  Schedule entries: ${sat.schedule.length}`);
  console.log(`  Start times: ${Array.from(uniqueTimes).join(', ')}`);
  console.log(`  Unique times: ${uniqueTimes.size}`);
  
  if (uniqueTimes.size > 1) {
    console.log(`  ⚠️  MULTIPLE START TIMES - Should these be separate DB entries?`);
  } else {
    console.log(`  ✅ Single start time - Correct`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('CONCLUSION');
console.log('='.repeat(80));

let hasMultipleTimes = false;
db.satellites.forEach(sat => {
  const uniqueTimes = new Set(sat.schedule.map(s => s.time));
  if (uniqueTimes.size > 1) {
    hasMultipleTimes = true;
  }
});

if (hasMultipleTimes) {
  console.log(`\n❌ ISSUE FOUND: Some satellites have multiple different start times`);
  console.log(`   According to the requirement, each unique time should be a separate entry`);
  console.log(`\n   Current structure: 3 satellites with multiple times per satellite`);
  console.log(`   Should be: Multiple entries (one per unique time)`);
  console.log(`\n   Example:`);
  console.log(`   SAT-1 @ 10:00 AM (runs Mar 31 - Apr 10)`);
  console.log(`   SAT-1 @ 2:00 PM (runs Mar 31 - Apr 10)`);
  console.log(`   SAT-1 @ 6:00 PM (runs Mar 31 - Apr 10)`);
  console.log(`   SAT-1 @ 10:00 PM (runs Mar 31 - Apr 10)`);
} else {
  console.log(`\n✅ All satellites have single start times - Correct`);
}
