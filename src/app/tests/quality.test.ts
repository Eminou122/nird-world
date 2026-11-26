import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { matchPath } from 'react-router'
import { buildingPath, buildings } from '../../data/buildings.ts'
import { categories } from '../../features/library/data/categories.ts'
import { tools } from '../../features/library/data/software.ts'
import { diagnosticPaths } from '../../features/diagnostic/paths.ts'
import { libraryPaths } from '../../features/library/paths.ts'
import { routePaths } from '../routePaths.ts'

/** Which page a link opens, using React Router's own matching, most specific route first (as the router does). */
const ORDER = ['village', 'ecole', 'questionnaire', 'results', 'history', 'library', 'tool', 'compare', 'building'] as const
function pageFor(href: string): (typeof ORDER)[number] | null {
  const pathname = new URL(href, 'https://nird.test').pathname
  return ORDER.find((name) => matchPath('/' + routePaths[name], pathname)) ?? null
}

test('every generated link opens the intended page', () => {
  assert.equal(pageFor(diagnosticPaths.intro), 'ecole')
  assert.equal(pageFor(diagnosticPaths.questionnaire), 'questionnaire')
  assert.equal(pageFor(diagnosticPaths.results('abc-123')), 'results')
  assert.equal(pageFor(diagnosticPaths.results()), 'results')
  assert.equal(pageFor(diagnosticPaths.history), 'history')
  assert.equal(pageFor(libraryPaths.home), 'library')
  assert.equal(pageFor(libraryPaths.compare(['gimp', 'krita'])), 'compare')
  for (const category of categories) assert.equal(pageFor(libraryPaths.category(category.id)), 'library')
  for (const tool of tools) assert.equal(pageFor(libraryPaths.tool(tool.id)), 'tool', tool.id)
})

test('each building leads to its own page, open ones to their dedicated section', () => {
  for (const building of buildings) {
    const page = pageFor(buildingPath(building.slug))
    if (building.slug === 'ecole') assert.equal(page, 'ecole')
    else if (building.slug === 'bibliotheque') assert.equal(page, 'library')
    else assert.equal(page, 'building', building.slug)
  }
  assert.deepEqual(
    buildings.filter((b) => b.open).map((b) => b.slug),
    ['ecole', 'bibliotheque'],
  )
  for (const building of buildings.filter((b) => b.open)) assert.ok(building.enterLabel, building.slug)
})

/* ---------- Static accessibility checks on the source ---------- */

const SOURCE = join(import.meta.dirname, '..', '..')
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : entry.name.endsWith('.tsx') ? [join(dir, entry.name)] : [],
  )
const sources = files(SOURCE).map((file) => ({ file: file.slice(SOURCE.length + 1), code: readFileSync(file, 'utf8') }))

test('no click handler on an element the keyboard cannot reach', () => {
  for (const { file, code } of sources) {
    assert.doesNotMatch(code, /<(div|span|li|p|section|article|img)\b[^>]*\sonClick=/, file)
  }
})

test('every <button> declares its type, so none submits a form by accident', () => {
  for (const { file, code } of sources) {
    for (const match of code.matchAll(/<button\b([^>]*)>/g)) {
      // Buttons inside <form method="dialog"> close the dialog: their default type is intended.
      if (code.includes('method="dialog"') && !match[1]!.includes('type=')) continue
      assert.match(match[1]!, /\btype=/, `${file}: <button${match[1]!.slice(0, 60)}`)
    }
  }
})

test('links opening a new tab are safe and say so', () => {
  for (const { file, code } of sources) {
    for (const match of code.matchAll(/<a\b[^>]*target="_blank"[^>]*>[\s\S]*?<\/a>/g)) {
      assert.match(match[0], /rel="noopener noreferrer"/, file)
      assert.match(match[0], /nouvel onglet/, file)
    }
  }
})

test('the page language and a skip link are set', () => {
  assert.match(readFileSync(join(SOURCE, '..', 'index.html'), 'utf8'), /<html lang="fr">/)
  const layout = sources.find(({ file }) => file.endsWith('RootLayout.tsx'))!.code
  assert.match(layout, /href="#contenu"/)
  assert.match(layout, /id="contenu"/)
})
