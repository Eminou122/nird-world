import assert from 'node:assert/strict'
import { test } from 'node:test'
import { categories, searchExamples } from '../data/categories.ts'
import { explanations } from '../data/explanations.ts'
import { getTool, tools } from '../data/software.ts'
import { cleanSelection, toggleSelection } from '../services/comparison.ts'
import { runsOn, searchTools, type Filters } from '../services/search.ts'

const find = (filters: Partial<Filters>) =>
  searchTools(tools, { query: '', category: null, platform: null, ...filters }).map((tool) => tool.id)

test('the catalogue is consistent', () => {
  assert.equal(new Set(tools.map((tool) => tool.id)).size, tools.length)
  for (const tool of tools) {
    assert.ok(tool.useCases.length >= 2, `${tool.id} use cases`)
    assert.ok(tool.advantages.length >= 1 && tool.limitations.length >= 1, `${tool.id} shows both sides`)
    assert.ok(tool.dataNote.length > 20, `${tool.id} data note`)
    for (const url of [tool.website, ...tool.sources.map((source) => source.url)]) assert.match(url, /^https:\/\//, tool.id)
    for (const other of tool.alternatives) {
      assert.ok(getTool(other), `${tool.id} → ${other}`)
      assert.notEqual(other, tool.id)
    }
  }
})

test('every category leads to at least three tools', () => {
  assert.equal(categories.length, 6)
  for (const category of categories) assert.ok(find({ category: category.id }).length >= 3, category.id)
})

test('every licence is a known open-source licence', () => {
  for (const tool of tools) assert.match(tool.license.name, /^(MPL|GPL|LGPL|AGPL|Apache|MIT)\b/, tool.id)
})

test('texts never promise guaranteed privacy or a universal winner', () => {
  const forbidden = /garantit? (la|votre) (vie privée|sécurité)|100 ?% sécuris|le meilleur (outil|logiciel)|totalement anonyme/i
  for (const tool of tools) assert.doesNotMatch(JSON.stringify(tool), forbidden, tool.id)
  assert.match(explanations.find((item) => item.id === 'donnees')!.paragraphs[0]!, /^Non/)
})

test('search by name ignores case and accents', () => {
  assert.equal(find({ query: 'moodle' })[0], 'moodle')
  assert.equal(find({ query: 'LIBRE' })[0], 'libreoffice')
  assert.equal(find({ query: 'obs studio' })[0], 'obs')
})

test('search by what people want to do', () => {
  assert.ok(find({ query: 'je veux faire une affiche' }).includes('gimp'))
  assert.equal(find({ query: 'podcast' })[0], 'audacity')
  assert.ok(find({ query: 'vidéos' }).includes('peertube'))
  assert.ok(find({ query: 'video' }).includes('obs'))
  assert.equal(find({ query: 'mots de passe' })[0], 'keepassxc')
  assert.equal(find({ query: 'sans internet' })[0], 'kolibri')
  assert.ok(find({ query: 'réunion parents' }).includes('jitsi'))
})

test('search by the product people already use', () => {
  assert.equal(find({ query: 'word' })[0], 'libreoffice')
  assert.equal(find({ query: 'remplacer Word' })[0], 'libreoffice')
  assert.ok(find({ query: 'une alternative à Photoshop' }).includes('gimp'))
  assert.ok(find({ query: 'photoshop' }).includes('gimp'))
  assert.ok(find({ query: 'zoom' }).includes('jitsi') && find({ query: 'zoom' }).includes('bigbluebutton'))
})

test('every suggested search on the home page finds something', () => {
  for (const example of searchExamples) assert.ok(find({ query: example }).length > 0, example)
  assert.equal(find({ query: 'cours sans internet' })[0], 'kolibri')
})

test('filters combine with the search', () => {
  assert.deepEqual(find({ query: 'visio', category: 'enseigner' }), ['bigbluebutton'])
  assert.ok(!find({ category: 'creer', platform: 'android' }).includes('gimp'))
  assert.deepEqual(find({ category: 'creer', platform: 'android' }), ['krita'])
})

test('tools used in a browser count as working on any computer, not on phones', () => {
  const cryptpad = getTool('cryptpad')!
  assert.equal(runsOn(cryptpad, 'linux'), true)
  assert.equal(runsOn(cryptpad, 'android'), false)
})

test('no result, empty and odd queries are safe', () => {
  assert.deepEqual(find({ query: 'trottinette' }), [])
  assert.equal(find({ query: '   ' }).length, tools.length)
  assert.equal(find({ query: '?!.*(' }).length, tools.length)
  assert.equal(find({ query: 'le' }).length > 0, true)
})

test('comparison holds two or three known tools, without duplicates', () => {
  const known = (id: string) => getTool(id) !== undefined
  assert.deepEqual(cleanSelection(['gimp', 'inconnu', 'gimp', 'krita', 4, 'inkscape', 'obs'], known), ['gimp', 'krita', 'inkscape'])
  assert.deepEqual(cleanSelection('gimp', known), [])
  assert.deepEqual(cleanSelection(null, known), [])
  assert.deepEqual(toggleSelection(['gimp'], 'krita'), ['gimp', 'krita'])
  assert.deepEqual(toggleSelection(['gimp', 'krita'], 'gimp'), ['krita'])
  assert.deepEqual(toggleSelection(['gimp', 'krita', 'obs'], 'jitsi'), ['gimp', 'krita', 'obs'])
})
