-- ============================================================
-- FULL SCHEMA — Paste & Run in Supabase → SQL Editor
-- ============================================================

-- 1. Create Role enum safely
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. User table
CREATE TABLE IF NOT EXISTS "User" (
  "id"        TEXT         NOT NULL,
  "email"     TEXT         NOT NULL,
  "password"  TEXT         NOT NULL,
  "name"      TEXT,
  "role"      "Role"       NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- 3. Profile table
CREATE TABLE IF NOT EXISTS "Profile" (
  "id"           TEXT         NOT NULL,
  "userId"       TEXT         NOT NULL,
  "name"         TEXT,
  "headline"     TEXT,
  "bio"          TEXT,
  "bio2"         TEXT,
  "avatarUrl"    TEXT,
  "location"     TEXT,
  "email"        TEXT,
  "githubUrl"    TEXT,
  "linkedinUrl"  TEXT,
  "twitterUrl"   TEXT,
  "resumeUrl"    TEXT,
  "stats"        JSONB,
  "highlights"   JSONB,
  "skillGroups"  JSONB,
  "extraSkills"  JSONB,
  "experiences"  JSONB,
  "education"    JSONB,
  "achievements" JSONB,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Profile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Profile_userId_key" ON "Profile"("userId");

-- 4. ContactMessage table
CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id"        TEXT         NOT NULL,
  "name"      TEXT         NOT NULL,
  "email"     TEXT         NOT NULL,
  "message"   TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- 5. Project table
CREATE TABLE IF NOT EXISTS "Project" (
  "id"          TEXT         NOT NULL,
  "title"       TEXT         NOT NULL,
  "description" TEXT         NOT NULL,
  "imageUrl"    TEXT,
  "videoUrl"    TEXT,
  "liveDemoUrl" TEXT,
  "repoUrl"     TEXT,
  "techStack"   TEXT[]       NOT NULL DEFAULT '{}',
  "featured"    BOOLEAN      NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- 6. ProjectCategory table
CREATE TABLE IF NOT EXISTS "ProjectCategory" (
  "id"   TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ProjectCategory_name_key" ON "ProjectCategory"("name");

-- 7. Project <-> Category join table
CREATE TABLE IF NOT EXISTS "_ProjectToProjectCategory" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_ProjectToProjectCategory_A_fkey"
    FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "_ProjectToProjectCategory_B_fkey"
    FOREIGN KEY ("B") REFERENCES "ProjectCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "_ProjectToProjectCategory_AB_unique"
  ON "_ProjectToProjectCategory"("A", "B");
CREATE INDEX IF NOT EXISTS "_ProjectToProjectCategory_B_index"
  ON "_ProjectToProjectCategory"("B");

-- ============================================================
-- 8. Seed ADMIN user
--    Email   : vanshsoni513@gmail.com
--    Password: Admin@1234
-- ============================================================
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'vanshsoni513@gmail.com',
  '$argon2id$v=19$m=65536,t=3,p=4$g5WT78fxT1XMujFxhmGrww$Pz5PtZB73VqJGsjH0UmoB4as77I2vENEljaQlNAiD/A',
  'Vansh Soni',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
  SET role = 'ADMIN', password = EXCLUDED.password;

-- Done! ✅
