/**
 * Run with:  npx ts-node src/gen-hash.ts
 * Prints the argon2 hash for a password — paste it into Supabase SQL Editor
 */
import argon2 from 'argon2';

const PASSWORD = 'Admin@1234';

argon2.hash(PASSWORD).then((hash) => {
  console.log('\n✅ Password hash generated!\n');
  console.log('Password :', PASSWORD);
  console.log('Hash     :', hash);
  console.log('\nRun this SQL in Supabase SQL Editor:');
  console.log(`
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'vanshsoni513@gmail.com',
  '${hash}',
  'Vansh Soni',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
  SET role = 'ADMIN', password = EXCLUDED.password;
  `);
});
