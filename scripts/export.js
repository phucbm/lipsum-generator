import { createWriteStream } from 'fs';
import { readdir, mkdir, rm, stat, copyFile } from 'fs/promises';
import { resolve, join, dirname } from 'path';
import archiver from 'archiver';

const version = '4.0.1';
const files = [
  'assets',
  'index.html',
  'manifest.json',
  'background.js',
  'content.js'
];

async function exportExtension() {
  const distDir = resolve(process.cwd(), 'dist');
  const extensionDir = resolve(process.cwd(), 'extension');
  const zipPath = join(extensionDir, `lipsum-extension-${version}.zip`);

  try {
    // Clean up old dist
    await rm(distDir, { recursive: true, force: true });
    await mkdir(distDir, { recursive: true });

    // Copy files to dist
    console.log('📦 Copying files to dist...');
    for (const file of files) {
      const src = resolve(process.cwd(), file);
      const dest = resolve(distDir, file);

      const stats = await stat(src);
      if (stats.isDirectory()) {
        await copyDir(src, dest);
      } else {
        await mkdir(dirname(dest), { recursive: true });
        await copyFile(src, dest);
      }
    }

    // Create extension directory
    await mkdir(extensionDir, { recursive: true });

    // Create zip
    console.log('🗜️  Creating zip file...');
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(distDir, false);
    await archive.finalize();

    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
    });

    console.log(`✅ Extension exported to: ${zipPath}`);
    console.log(`   Size: ${(archive.pointer() / 1024).toFixed(2)} KB`);

    // Clean up dist
    await rm(distDir, { recursive: true, force: true });
    console.log('🧹 Cleaned up dist folder');

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

exportExtension();
