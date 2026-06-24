const { execFileSync } = require('node:child_process')
const { copyFileSync, cpSync, existsSync, mkdirSync } = require('node:fs')
const { join } = require('node:path')

const MIMO_CORE_REQUIRED_PATHS = [
  'MIMO-Work-Core/package.json',
  'MIMO-Work-Core/packages/opencode/dist'
]

function normalizePlatform(platform) {
  return platform === 'win' ? 'win32' : platform
}

function appBundlePath(context) {
  return join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`)
}

function packedResourcesDir(context) {
  if (normalizePlatform(context.electronPlatformName) === 'darwin') {
    return join(appBundlePath(context), 'Contents', 'Resources')
  }
  return join(context.appOutDir, 'resources')
}

function unpackedAppRoot(context) {
  return join(packedResourcesDir(context), 'app.asar.unpacked')
}

function assertExists(path, label) {
  if (!existsSync(path)) {
    throw new Error(`[after-pack] Missing ${label}: ${path}`)
  }
}

function npmCommand(args, platform = process.platform) {
  if (platform === 'win32') {
    return {
      command: 'cmd.exe',
      args: ['/d', '/s', '/c', 'npm', ...args]
    }
  }
  return { command: 'npm', args }
}

function validateBundledMimoRuntime(context) {
  const root = unpackedAppRoot(context)
  assertExists(
    join(root, 'node_modules', 'better-sqlite3', 'package.json'),
    'root better-sqlite3 dependency'
  )
  const resources = packedResourcesDir(context)
  for (const relativePath of MIMO_CORE_REQUIRED_PATHS) {
    assertExists(join(resources, relativePath), relativePath)
  }
}

function sourceMimoCoreDir() {
  return process.env.MIMO_WORK_CORE_DIR || join(__dirname, '..', '..', 'MIMO-Work-Core')
}

function ensureBundledMimoRuntime(context) {
  const resources = packedResourcesDir(context)
  const target = join(resources, 'MIMO-Work-Core')
  if (existsSync(join(target, 'packages', 'opencode', 'dist'))) return

  const source = sourceMimoCoreDir()
  assertExists(join(source, 'package.json'), 'source MIMO-Work-Core package.json')
  assertExists(join(source, 'packages', 'opencode', 'dist'), 'source MIMO-Work-Core opencode dist')

  mkdirSync(target, { recursive: true })
  mkdirSync(join(target, 'packages', 'opencode'), { recursive: true })
  copyFileSync(join(source, 'package.json'), join(target, 'package.json'))
  cpSync(
    join(source, 'packages', 'opencode', 'dist'),
    join(target, 'packages', 'opencode', 'dist'),
    { recursive: true }
  )
}

function maybeAdhocSignMacApp(context) {
  if (normalizePlatform(context.electronPlatformName) !== 'darwin') {
    return
  }

  if (
    process.env.CSC_LINK ||
    process.env.CSC_NAME ||
    process.env.CSC_KEY_PASSWORD ||
    process.env.MAC_SIGN === '1'
  ) {
    console.log('[after-pack] Developer ID signing is enabled, skipping ad-hoc signing.')
    return
  }

  const appBundle = appBundlePath(context)
  if (!existsSync(appBundle)) {
    throw new Error(`[after-pack] App bundle not found for ad-hoc signing: ${appBundle}`)
  }

  execFileSync(
    'codesign',
    ['--force', '--deep', '--sign', '-', '--timestamp=none', appBundle],
    { stdio: 'inherit' }
  )
}

async function afterPack(context) {
  ensureBundledMimoRuntime(context)
  validateBundledMimoRuntime(context)
  maybeAdhocSignMacApp(context)
}

module.exports = afterPack
module.exports.default = afterPack
module.exports.MIMO_CORE_REQUIRED_PATHS = MIMO_CORE_REQUIRED_PATHS
module.exports._internals = {
  appBundlePath,
  packedResourcesDir,
  unpackedAppRoot,
  npmCommand,
  ensureBundledMimoRuntime,
  sourceMimoCoreDir,
  validateBundledMimoRuntime
}
