#!/usr/bin/env tsx
/**
 * Type Generation Script
 * 
 * This script:
 * 1. Generates Zod schemas from Prisma models
 * 2. Copies all DTOs and Zod schemas to the frontend
 * 3. Ensures type safety between backend and frontend
 */

import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

const ROOT_DIR = join(__dirname, '../..');
const BACKEND_DIR = join(ROOT_DIR, 'backend');
const FRONTEND_DIR = join(ROOT_DIR, 'web');
const BACKEND_DTO_DIR = join(BACKEND_DIR, 'src/dtos');
const FRONTEND_TYPES_DIR = join(FRONTEND_DIR, 'src/types/generated');

console.log('🚀 Starting type generation process...\n');

// Step 1: Generate Prisma Client and Zod schemas
console.log('📦 Step 1: Generating Prisma Client and Zod schemas...');
try {
  execSync('npx prisma generate', { 
    cwd: BACKEND_DIR,
    stdio: 'inherit'
  });
  console.log('✅ Prisma generation complete\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma schemas');
  process.exit(1);
}

// Step 2: Ensure frontend types directory exists
console.log('📁 Step 2: Setting up frontend types directory...');
if (!existsSync(FRONTEND_TYPES_DIR)) {
  mkdirSync(FRONTEND_TYPES_DIR, { recursive: true });
  console.log(`✅ Created directory: ${FRONTEND_TYPES_DIR}\n`);
} else {
  console.log(`✅ Directory exists: ${FRONTEND_TYPES_DIR}\n`);
}

// Step 3: Copy DTO files to frontend
console.log('📋 Step 3: Copying DTO files to frontend...');
const dtoFiles = readdirSync(BACKEND_DTO_DIR).filter(file => 
  file.endsWith('.ts') && !file.endsWith('.d.ts')
);

let copiedCount = 0;
for (const file of dtoFiles) {
  const srcPath = join(BACKEND_DTO_DIR, file);
  const destPath = join(FRONTEND_TYPES_DIR, file);
  
  try {
    copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copied ${file}`);
    copiedCount++;
  } catch (error) {
    console.error(`  ✗ Failed to copy ${file}:`, error);
  }
}
console.log(`✅ Copied ${copiedCount} DTO files\n`);

// Step 4: Copy generated Prisma Zod schemas (if they exist)
const prismaZodDir = join(BACKEND_DIR, 'src/generated/zod');
const frontendPrismaZodDir = join(FRONTEND_TYPES_DIR, 'prisma');

if (existsSync(prismaZodDir)) {
  console.log('📦 Step 4: Copying Prisma Zod schemas to frontend...');
  
  if (!existsSync(frontendPrismaZodDir)) {
    mkdirSync(frontendPrismaZodDir, { recursive: true });
  }

  function copyRecursive(src: string, dest: string) {
    const items = readdirSync(src);
    
    for (const item of items) {
      const srcPath = join(src, item);
      const destPath = join(dest, item);
      
      if (statSync(srcPath).isDirectory()) {
        if (!existsSync(destPath)) {
          mkdirSync(destPath, { recursive: true });
        }
        copyRecursive(srcPath, destPath);
      } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
        copyFileSync(srcPath, destPath);
        console.log(`  ✓ Copied prisma/${item}`);
      }
    }
  }
  
  try {
    copyRecursive(prismaZodDir, frontendPrismaZodDir);
    console.log('✅ Prisma Zod schemas copied\n');
  } catch (error) {
    console.error('⚠️  Failed to copy Prisma Zod schemas:', error);
  }
} else {
  console.log('⚠️  Step 4: Prisma Zod schemas not found (skipping)\n');
}

console.log('🎉 Type generation complete!');
console.log('\n📝 Summary:');
console.log(`   - Backend DTOs: ${BACKEND_DTO_DIR}`);
console.log(`   - Frontend types: ${FRONTEND_TYPES_DIR}`);
console.log(`   - Files copied: ${copiedCount}`);
console.log('\n💡 These types are now available in your frontend with runtime validation!');

