/**
 * sync-templates.js
 * Copies template files from the bain-riper repo root into cli/templates/.
 * Run via `npm run sync` or automatically via `prepublishOnly`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_DIR = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(CLI_DIR, 'templates');
const REPO_ROOT = path.resolve(CLI_DIR, '..');

const start = Date.now();
let fileCount = 0;

/**
 * Copy a single file from src to dest, creating directories as needed.
 */
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  fileCount++;
  console.log(`  ✓ ${path.relative(REPO_ROOT, src)} → ${path.relative(CLI_DIR, dest)}`);
}

/**
 * Copy all files from srcDir to destDir recursively.
 */
function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`  ⚠ Source directory not found: ${srcDir}`);
    return;
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// Step 1: Clean templates/
console.log('\n  Cleaning templates/...\n');
if (fs.existsSync(TEMPLATES_DIR)) {
  fs.rmSync(TEMPLATES_DIR, { recursive: true });
}
fs.mkdirSync(TEMPLATES_DIR, { recursive: true });

// Step 2: Copy .qoder/rules/ → templates/qoder/rules/
console.log('  Copying rules...');
copyDir(
  path.join(REPO_ROOT, '.qoder', 'rules'),
  path.join(TEMPLATES_DIR, 'qoder', 'rules')
);

// Step 3: Copy .qoder/skills/ → templates/qoder/skills/
console.log('\n  Copying skills...');
copyDir(
  path.join(REPO_ROOT, '.qoder', 'skills'),
  path.join(TEMPLATES_DIR, 'qoder', 'skills')
);

// Step 4: Copy .qoder/mcp.json → templates/qoder/mcp.json
console.log('\n  Copying mcp.json...');
copyFile(
  path.join(REPO_ROOT, '.qoder', 'mcp.json'),
  path.join(TEMPLATES_DIR, 'qoder', 'mcp.json')
);

// Step 5: Copy openspec/config.yaml + openspec/project-profile.md
console.log('\n  Copying openspec configs...');
copyFile(
  path.join(REPO_ROOT, 'openspec', 'config.yaml'),
  path.join(TEMPLATES_DIR, 'openspec', 'config.yaml')
);
copyFile(
  path.join(REPO_ROOT, 'openspec', 'project-profile.md'),
  path.join(TEMPLATES_DIR, 'openspec', 'project-profile.md')
);

// Step 6: Copy docs/reference-code/ → templates/docs/reference-code/
console.log('\n  Copying reference code...');
copyDir(
  path.join(REPO_ROOT, 'docs', 'reference-code'),
  path.join(TEMPLATES_DIR, 'docs', 'reference-code')
);

// Done
const elapsed = Date.now() - start;
console.log(`\n  ✅ Synced ${fileCount} files in ${elapsed}ms\n`);
