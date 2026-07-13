/* global console, process */
// 把 uni_modules/see-u-ui/ 同步到 npm 发布根 see-u-ui-npm/src/
// 等价于 CI 中 rsync -av --delete 的生命周期内操作
// 运行：node scripts/sync-npm.mjs
// `pnpm ai:gen` 已包含这一步（在 web-types 生成后执行）
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'uni_modules/see-u-ui')
const NPM_ROOT = 'E:/000seeuui/see-u-ui-npm'
const DEST = path.join(NPM_ROOT, 'src')
const EXCLUDE = new Set(['.git', 'node_modules', '.DS_Store'])

if (!fs.existsSync(NPM_ROOT)) {
  console.log('[sync-npm] npm 发布根不存在，跳过同步:', NPM_ROOT)
  process.exit(0)
}
if (!fs.existsSync(SRC)) {
  console.error('[sync-npm] 源目录不存在:', SRC)
  process.exit(1)
}

// 递归收集相对路径集合（仅文件）
function collectFiles(dir, prefix = '') {
  const files = new Set()
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (EXCLUDE.has(e.name)) continue
    const rel = prefix ? prefix + '/' + e.name : e.name
    if (e.isDirectory()) {
      for (const f of collectFiles(path.join(dir, e.name), rel)) files.add(f)
    } else {
      files.add(rel)
    }
  }
  return files
}

// 收集空目录集合（仅目录，用于清理孤儿空目录）
function collectDirs(dir, prefix = '') {
  const dirs = new Set()
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (EXCLUDE.has(e.name)) continue
    const rel = prefix ? prefix + '/' + e.name : e.name
    if (e.isDirectory()) {
      dirs.add(rel)
      for (const f of collectDirs(path.join(dir, e.name), rel)) dirs.add(f)
    }
  }
  return dirs
}

console.log('[sync-npm] ' + SRC + '  →  ' + DEST)
const srcFiles = collectFiles(SRC)

// 第1步：复制差异文件（缺失或内容不同）
let copied = 0,
  skipped = 0
for (const rel of srcFiles) {
  const srcPath = path.join(SRC, rel)
  const destPath = path.join(DEST, rel)
  const destDir = path.dirname(destPath)
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  // 缺文件 或 mtime(±2ms容差)+size 任一不同则复制
  let needsCopy = true
  try {
    const sStat = fs.statSync(srcPath)
    const dStat = fs.statSync(destPath)
    needsCopy = Math.abs(sStat.mtimeMs - dStat.mtimeMs) > 2 || sStat.size !== dStat.size
  } catch {
    // dest 不存在
  }
  if (needsCopy) {
    fs.copyFileSync(srcPath, destPath)
    // 保持文件时间戳以便下次比对
    const stat = fs.statSync(srcPath)
    fs.utimesSync(destPath, stat.atime, stat.mtime)
    copied++
  } else {
    skipped++
  }
}

// 第2步：删除 DEST 多出的孤儿文件
const destFiles = collectFiles(DEST)
let deleted = 0
for (const rel of destFiles) {
  if (!srcFiles.has(rel)) {
    fs.rmSync(path.join(DEST, rel))
    deleted++
  }
}

// 第3步：清理 DEST 里孤儿空目录
const srcDirs = collectDirs(SRC)
const destDirs = [...collectDirs(DEST)].sort((a, b) => b.split('/').length - a.split('/').length) // 从最深开始删
let emptyRemoved = 0
for (const rel of destDirs) {
  if (srcDirs.has(rel)) continue
  const full = path.join(DEST, rel)
  try {
    // 只在真为空时删（避免并发写入造成误删）
    if (fs.readdirSync(full).length === 0) {
      fs.rmdirSync(full)
      emptyRemoved++
    }
  } catch {
    // 可能已被父目录的 rmdir 连带删了
  }
}

const total = copied + skipped
console.log('[sync-npm] ok · total=' + total + ' copied=' + copied + ' skipped=' + skipped + ' deleted=' + deleted + ' emptyDirs=' + emptyRemoved)
