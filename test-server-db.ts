import { DatabaseManager } from './server-backend/database';

async function main() {
  const db = DatabaseManager.getInstance();
  try {
    console.log('Testing authenticateUser...');
    const result = await db.authenticateUser('test_user_xyz', 'some_password_123');
    console.log('Authentication result (expected false, got):', result);
  } catch (err: any) {
    console.error('Authentication threw error:', err);
    if (err.stack) {
      console.error(err.stack);
    }
  }
}

main();
