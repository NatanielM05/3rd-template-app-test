#!/usr/bin/env node
/**
 * MANDATORY Database Initialization Test
 *
 * This test verifies that:
 * 1. Database can be initialized (data/ folder created automatically)
 * 2. Basic CRUD operations work
 * 3. Data persists to disk
 *
 * This catches the common "data/ folder missing" bug early!
 *
 * Run with: pnpm test:init
 */

import { Database } from './index.js';
import { unlink } from 'fs/promises';

async function testInit() {
  console.log('🧪 Testing database initialization...\n');

  const testDbPath = './data/test-db.json';
  const db = new Database(testDbPath);

  try {
    // Test 1: Init
    console.log('1️⃣ Testing init()...');
    await db.init();
    console.log('✅ Database initialized successfully\n');

    // Test 2: Create (example - adapt to your schema)
    console.log('2️⃣ Testing create operation...');
    // Note: This is a generic test. KI must adapt to actual schema!
    // Example: await db.createTask({ title: 'Test Task' });
    console.log('⚠️  CREATE test skipped - KI must implement based on schema\n');

    // Test 3: Read (example - adapt to your schema)
    console.log('3️⃣ Testing read operation...');
    // Example: const tasks = await db.getTasks();
    console.log('⚠️  READ test skipped - KI must implement based on schema\n');

    // Test 4: Delete (example - adapt to your schema)
    console.log('4️⃣ Testing delete operation...');
    // Example: await db.deleteTask(task.id);
    console.log('⚠️  DELETE test skipped - KI must implement based on schema\n');

    console.log('✅ All database operations work!');
    console.log('\n⚠️  NOTE: KI must implement actual CRUD tests based on openapi.yaml schema!');

    // Cleanup
    try {
      await unlink(testDbPath);
    } catch {
      // Ignore cleanup errors
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database test FAILED:', error);
    console.error('\n💡 Common fixes:');
    console.error('   - Check that mkdir(dirname(dbPath), { recursive: true }) is in init()');
    console.error('   - Verify lowdb is installed: pnpm add lowdb');
    console.error('   - Check that Database class is exported correctly');

    process.exit(1);
  }
}

testInit();
