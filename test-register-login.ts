import { DatabaseManager } from './server-backend/database';

async function main() {
  const db = DatabaseManager.getInstance();
  const testUser = 'user_' + Math.random().toString(36).substring(7);
  const password = 'mypassword123';
  
  console.log(`Testing with user: ${testUser}`);
  
  try {
    console.log('1. Attempting to register user...');
    const regResult = await db.registerUser(testUser, password);
    console.log('Registration result (expected true):', regResult);

    console.log('2. Attempting to register same user again...');
    const regResult2 = await db.registerUser(testUser, password);
    console.log('Registration result (expected false):', regResult2);

    console.log('3. Attempting to authenticate with correct password...');
    const authResult = await db.authenticateUser(testUser, password);
    console.log('Auth result (expected true):', authResult);

    console.log('4. Attempting to authenticate with incorrect password...');
    const authResult2 = await db.authenticateUser(testUser, 'wrongpassword');
    console.log('Auth result (expected false):', authResult2);
  } catch (err: any) {
    console.error('Test threw an error:', err);
    if (err.stack) {
      console.error(err.stack);
    }
  }
}

main();
