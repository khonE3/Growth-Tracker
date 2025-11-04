// ไฟล์นี้ใช้สำหรับทดสอบการเชื่อมต่อ Supabase
// เปิดหน้านี้ใน Browser แล้วดู Console

import { supabase } from './lib/supabase'

console.log('🔍 Testing Supabase Connection...')
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

// Test 1: Check connection
async function testConnection() {
  try {
    console.log('\n📡 Test 1: Checking Supabase connection...')
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection Error:', error)
      return false
    }
    console.log('✅ Connection successful!')
    console.log('Data:', data)
    return true
  } catch (err) {
    console.error('❌ Exception:', err)
    return false
  }
}

// Test 2: Try to insert data
async function testInsert() {
  try {
    console.log('\n📝 Test 2: Trying to insert a todo...')
    const testTodo = {
      title: 'Test Todo',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      created_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('todos')
      .insert([testTodo])
      .select()
    
    if (error) {
      console.error('❌ Insert Error:', error)
      return false
    }
    console.log('✅ Insert successful!')
    console.log('Inserted data:', data)
    return true
  } catch (err) {
    console.error('❌ Exception:', err)
    return false
  }
}

// Run tests
export async function runTests() {
  const connected = await testConnection()
  if (connected) {
    await testInsert()
  }
}

// Auto-run on import (for debugging)
if (typeof window !== 'undefined') {
  runTests()
}

export { testConnection, testInsert }
