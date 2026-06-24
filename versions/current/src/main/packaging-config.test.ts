import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const builderConfig = require('../../electron-builder.config.cjs')
const afterPack = require('../../scripts/after-pack.cjs')
const macNotarize = require('../../scripts/mac-notarize.cjs')

const tempRoots: string[] = []

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'ds-gui-packaging-'))
  tempRoots.push(root)
  return root
}

function touch(path: string): void {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, '{}\n', 'utf8')
}

function loadBuilderConfigWithEnv(env: Record<string, string | undefined>): typeof builderConfig {
  const configPath = require.resolve('../../electron-builder.config.cjs')
  const previous = new Map<string, string | undefined>()
  for (const [key, value] of Object.entries(env)) {
    previous.set(key, process.env[key])
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }

  delete require.cache[configPath]
  try {
    return require(configPath)
  } finally {
    delete require.cache[configPath]
    for (const [key, value] of previous) {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
    require(configPath)
  }
}

function createMacPackContext(root: string): {
  appOutDir: string
  electronPlatformName: string
  packager: { appInfo: { productFilename: string } }
} {
  return {
    appOutDir: join(root, 'mac-arm64'),
    electronPlatformName: 'darwin',
    packager: {
      appInfo: {
        productFilename: 'MIMO Work'
      }
    }
  }
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop()
    if (root) rmSync(root, { recursive: true, force: true })
  }
})

describe('electron-builder MIMO Work packaging', () => {
  it('includes MiMo-Core as an extra resource in the packaged app', () => {
    expect(builderConfig.extraResources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        to: 'MIMO-Work-Core',
        filter: expect.arrayContaining([
          'package.json',
          'packages/opencode/dist/**/*'
        ])
      })
    ]))
    expect(builderConfig.asarUnpack).toEqual(expect.arrayContaining([
      '**/node_modules/better-sqlite3/**/*'
    ]))
  })

  it('bundles only project-owned public skills, not local user skill directories', () => {
    const serializedResources = JSON.stringify(builderConfig.extraResources)
    const skillResource = builderConfig.extraResources.find((resource: { to?: string }) =>
      resource.to === 'MIMO-Work-Skills'
    )

    expect(skillResource).toEqual(expect.objectContaining({
      from: expect.stringMatching(/resources[\\/]skills$/),
      to: 'MIMO-Work-Skills'
    }))
    expect(serializedResources).not.toContain('.agents/skills')
    expect(serializedResources).not.toContain('.codex/skills')
    expect(serializedResources).not.toContain('.claude/skills')
    expect(serializedResources).not.toContain('.hermes/skills')
    expect(serializedResources).not.toContain('.mimo-work/skills')
  })

  it('validates bundled MiMo-Core before release artifacts are created', () => {
    const root = tempRoot()
    const context = createMacPackContext(root)
    const resourcesRoot = afterPack._internals.packedResourcesDir(context)

    for (const relativePath of afterPack.MIMO_CORE_REQUIRED_PATHS) {
      touch(join(resourcesRoot, relativePath))
    }
    touch(join(afterPack._internals.unpackedAppRoot(context), 'node_modules/better-sqlite3/package.json'))

    expect(() => afterPack._internals.validateBundledMimoRuntime(context)).not.toThrow()

    rmSync(join(resourcesRoot, 'MIMO-Work-Core/packages/opencode/dist'), { recursive: true, force: true })

    expect(() => afterPack._internals.validateBundledMimoRuntime(context)).toThrow(
      /MIMO-Work-Core\/packages\/opencode\/dist/
    )
  })

  it('runs npm through cmd.exe during Windows afterPack hooks', () => {
    expect(afterPack._internals.npmCommand(['prune'], 'win32')).toEqual({
      command: 'cmd.exe',
      args: ['/d', '/s', '/c', 'npm', 'prune']
    })
    expect(afterPack._internals.npmCommand(['prune'], 'darwin')).toEqual({
      command: 'npm',
      args: ['prune']
    })
  })

  it('uses the generated Windows icon for installers and shortcuts', () => {
    expect(builderConfig.win.icon).toBe('./build/icon.ico')
  })

  it('requires Apple secure timestamps when Developer ID signing is enabled', () => {
    const signedConfig = loadBuilderConfigWithEnv({
      MAC_SIGN: '1'
    })

    expect(signedConfig.mac.identity).toBeUndefined()
    expect(signedConfig.mac.hardenedRuntime).toBe(true)
    expect(signedConfig.mac.forceCodeSigning).toBe(true)
    expect(signedConfig.mac.timestamp).toBe('http://timestamp.apple.com/ts01')
  })

  it('checks timestamp candidates across nested macOS signed code', () => {
    const root = tempRoot()
    const appBundle = join(root, 'Kun.app')
    const mainExecutable = join(appBundle, 'Contents/MacOS/Kun')
    const framework = join(appBundle, 'Contents/Frameworks/Electron Framework.framework')
    const nativeAddon = join(
      appBundle,
      'Contents/Resources/app.asar.unpacked/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
    )
    const resourceScript = join(appBundle, 'Contents/Resources/postinstall.sh')

    touch(mainExecutable)
    touch(join(framework, 'Versions/A/Electron Framework'))
    touch(nativeAddon)
    touch(resourceScript)
    chmodSync(mainExecutable, 0o755)
    chmodSync(resourceScript, 0o755)

    expect(macNotarize._internals.collectSignedCodeCandidates(appBundle)).toEqual([
      appBundle,
      framework,
      mainExecutable,
      nativeAddon
    ])
  })
})
