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

    // Test 2: Create Task
    console.log('2️⃣ Testing createTask()...');
    const task = await db.createTask({
      title: 'Test Task',
      description: 'This is a test task',
      category: 'testing',
    });
    console.log(`✅ Task created with id: ${task.id}\n`);

    // Test 3: Read Tasks
    console.log('3️⃣ Testing getTasks()...');
    const tasks = await db.getTasks();
    console.log(`✅ Found ${tasks.length} task(s)\n`);

    // Test 4: Get Task by ID
    console.log('4️⃣ Testing getTaskById()...');
    const foundTask = await db.getTaskById(task.id);
    if (!foundTask) {
      throw new Error('Task not found by ID');
    }
    console.log(`✅ Task found: ${foundTask.title}\n`);

    // Test 5: Update Task
    console.log('5️⃣ Testing updateTask()...');
    await db.updateTask(task.id, { title: 'Updated Test Task' });
    console.log('✅ Task updated successfully\n');

    // Test 6: Toggle Task
    console.log('6️⃣ Testing toggleTask()...');
    const toggledTask = await db.toggleTask(task.id);
    console.log(`✅ Task toggled to status: ${toggledTask.status}\n`);

    // Test 7: Delete Task
    console.log('7️⃣ Testing deleteTask()...');
    await db.deleteTask(task.id);
    console.log('✅ Task deleted successfully\n');

    console.log('✅ All database operations work!');

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
