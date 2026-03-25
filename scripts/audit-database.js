#!/usr/bin/env node

/**
 * Database Audit Script
 * Checks for duplicate entries based on tournament name + start time
 * Verifies each unique tournament/time combination has exactly one entry
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../src/data/tournaments.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('='.repeat(80));
console.log('WSOP EUROPE PRAGUE 2026 - DATABASE AUDIT');
console.log('='.repeat(80));
console.log('');

let totalIssues = 0;
const seen = new Map(); // Track name+time combinations

// Function to check a tournament array
function auditTournaments(tournaments, category) {
  console.log(`\n📋 ${category.toUpperCase()}`);
  console.log('-'.repeat(80));
  
  let categoryIssues = 0;
  
  tournaments.forEach((tournament, index) => {
    // For bracelet events, check flights
    if (category === 'bracelet' && tournament.flights && tournament.flights.length > 0) {
      tournament.flights.forEach(flight => {
        const uniqueKey = `${tournament.name} @ ${flight.time} on ${flight.date}`;
        const flightId = `${tournament.id}+Flight${flight.num}`;
        
        if (seen.has(uniqueKey)) {
          console.log(`❌ DUPLICATE: "${tournament.name}" - Flight ${flight.num} at ${flight.time} on ${flight.date}`);
          console.log(`   Previous entry: ${seen.get(uniqueKey)}`);
          console.log(`   Current entry: ${flightId}`);
          categoryIssues++;
          totalIssues++;
        } else {
          seen.set(uniqueKey, flightId);
        }
      });
    } 
    // For satellites, check each schedule time
    else if (category === 'satellite' && tournament.schedule && tournament.schedule.length > 0) {
      tournament.schedule.forEach(sched => {
        const uniqueKey = `${tournament.name} @ ${sched.time}`;
        const schedId = `${tournament.id}+${sched.time}`;
        
        if (seen.has(uniqueKey)) {
          console.log(`❌ DUPLICATE: "${tournament.name}" at ${sched.time}`);
          console.log(`   Previous entry: ${seen.get(uniqueKey)}`);
          console.log(`   Current entry: ${schedId}`);
          console.log(`   Runs: ${sched.runsDates}`);
          categoryIssues++;
          totalIssues++;
        } else {
          seen.set(uniqueKey, schedId);
        }
      });
    }
    // For side events, check each schedule time
    else if (category === 'side' && tournament.schedule && tournament.schedule.length > 0) {
      tournament.schedule.forEach(sched => {
        const uniqueKey = `${tournament.name} @ ${sched.time}`;
        const schedId = `${tournament.id}+${sched.time}`;
        
        if (seen.has(uniqueKey)) {
          console.log(`❌ DUPLICATE: "${tournament.name}" at ${sched.time}`);
          console.log(`   Previous entry: ${seen.get(uniqueKey)}`);
          console.log(`   Current entry: ${schedId}`);
          console.log(`   Runs: ${sched.runsDates}`);
          categoryIssues++;
          totalIssues++;
        } else {
          seen.set(uniqueKey, schedId);
        }
      });
    }
  });
  
  if (categoryIssues === 0) {
    console.log(`✅ All entries are unique (${tournaments.length} entries)`);
  }
  
  return categoryIssues;
}

// Audit each category
const braceletIssues = auditTournaments(db.braceletEvents, 'bracelet');
const satelliteIssues = auditTournaments(db.satellites, 'satellite');
const sideIssues = auditTournaments(db.sideEvents, 'side');

// Summary
console.log('\n' + '='.repeat(80));
console.log('AUDIT SUMMARY');
console.log('='.repeat(80));
console.log(`Bracelet Events: ${db.braceletEvents.length} tournaments`);
console.log(`  - Issues: ${braceletIssues}`);
console.log(`Satellite Events: ${db.satellites.length} satellites`);
console.log(`  - Issues: ${satelliteIssues}`);
console.log(`Side Events: ${db.sideEvents.length} side events`);
console.log(`  - Issues: ${sideIssues}`);
console.log('');
console.log(`Total unique tournament/time entries: ${seen.size}`);
console.log(`Total issues found: ${totalIssues}`);
console.log('');

if (totalIssues === 0) {
  console.log('✅ DATABASE AUDIT PASSED - All entries are unique!');
  process.exit(0);
} else {
  console.log('❌ DATABASE AUDIT FAILED - Duplicates detected!');
  process.exit(1);
}
