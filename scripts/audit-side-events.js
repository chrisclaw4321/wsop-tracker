#!/usr/bin/env node

/**
 * Side Events Audit Script
 * Checks side event structure and actual schedule variations
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

console.log('📊 CURRENT SIDE EVENTS STRUCTURE IN DATABASE:');
console.log('-'.repeat(80));

db.sideEvents.forEach((side, index) => {
  console.log(`\n${index + 1}. ${side.sideNum} - ${side.name}`);
  console.log(`   Buy-in: €${side.buyIn} + €${side.rake} = €${side.buyIn + side.rake}`);
  console.log(`   Starting Stack: ${side.startingStack || 'N/A'} chips`);
  console.log(`   Blind Levels: ${side.blindLevels.duration}-minute, starting at ${side.blindLevels.startingBlinds}`);
  console.log(`   GTD: €${side.gtd || 'N/A'}`);
  console.log(`   Schedule:`);
  
  side.schedule.forEach((sched, i) => {
    console.log(`     ${i + 1}. Time: ${sched.time}`);
    console.log(`        Runs: ${sched.runsDates}`);
  });
  
  console.log(`   Total schedule entries: ${side.schedule.length}`);
});

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS');
console.log('='.repeat(80));

console.log('\n🔍 Key Question: Do side events have DIFFERENT start times?');
console.log('-'.repeat(80));

let totalIssues = 0;
const eventsSummary = [];

db.sideEvents.forEach((side) => {
  const times = side.schedule.map(s => s.time);
  const uniqueTimes = new Set(times);
  
  console.log(`\n${side.sideNum}: ${side.name}`);
  console.log(`  Schedule entries: ${side.schedule.length}`);
  console.log(`  Start times: ${Array.from(uniqueTimes).join(', ')}`);
  console.log(`  Unique times: ${uniqueTimes.size}`);
  
  if (uniqueTimes.size > 1) {
    console.log(`  ⚠️  MULTIPLE START TIMES - Should be ${uniqueTimes.size} separate entries`);
    totalIssues += uniqueTimes.size - 1;
    eventsSummary.push({
      sideNum: side.sideNum,
      name: side.name,
      currentEntries: 1,
      shouldBe: uniqueTimes.size,
      times: Array.from(uniqueTimes)
    });
  } else {
    console.log(`  ✅ Single start time - Correct`);
    eventsSummary.push({
      sideNum: side.sideNum,
      name: side.name,
      currentEntries: 1,
      shouldBe: 1,
      times: Array.from(uniqueTimes)
    });
  }
});

console.log('\n' + '='.repeat(80));
console.log('RESTRUCTURING NEEDED');
console.log('='.repeat(80));

let totalNewEntries = 0;
eventsSummary.forEach(event => {
  if (event.shouldBe > 1) {
    console.log(`\n${event.sideNum}: ${event.name}`);
    console.log(`  Currently: 1 entry`);
    console.log(`  Should be: ${event.shouldBe} entries (one per time)`);
    event.times.forEach(time => {
      console.log(`    - ${event.sideNum} @ ${time}`);
      totalNewEntries++;
    });
  } else {
    totalNewEntries++;
  }
});

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

const currentTotal = db.sideEvents.length;
console.log(`\nCurrent side events in DB: ${currentTotal}`);
console.log(`Should be after restructuring: ${totalNewEntries}`);

if (totalIssues === 0) {
  console.log(`\n✅ All side events have single start times - Correct structure!`);
} else {
  console.log(`\n❌ RESTRUCTURING NEEDED: ${totalIssues} additional entries required`);
  console.log(`   Current entries: ${currentTotal}`);
  console.log(`   Required entries: ${totalNewEntries}`);
}
