/**
 * Run with:  npx ts-node src/seed-admin.ts
 *
 * This creates (or promotes) an ADMIN user in the database.
 * Edit EMAIL and PASSWORD below before running.
 */

import 'dotenv/config';
import argon2 from 'argon2';
import { prisma } from './utils/prisma';

const EMAIL    = 'vanshsoni513@gmail.com';  // ← change if needed
const PASSWORD = 'Admin@1234';              // ← use a strong password
const NAME     = 'Vansh Soni';

async function main() {
  const hash = await argon2.hash(PASSWORD);

  const existing = await prisma.user.findUnique({ where: { email: EMAIL } });

  if (existing) {
    // Promote existing user to ADMIN
    await prisma.user.update({
      where: { email: EMAIL },
      data: { role: 'ADMIN', password: hash },
    });
    console.log(`✅ User ${EMAIL} promoted to ADMIN.`);
  } else {
    await prisma.user.create({
      data: { email: EMAIL, password: hash, name: NAME, role: 'ADMIN' },
    });
    console.log(`✅ Admin user created: ${EMAIL}`);
  }

  console.log(`\n📋 Login credentials:`);
  console.log(`   Email   : ${EMAIL}`);
  console.log(`   Password: ${PASSWORD}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
