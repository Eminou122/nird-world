import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  BACKUP_KEY,
  STORAGE_KEY,
  emptyStore,
  loadStore,
  parseStore,
  saveStore,
  type DiagnosticStore,
  type KeyValueStorage,
} from '../services/storage.ts'

function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  }
}

const sample: DiagnosticStore = {
  version: 1,
  activeId: 'a1',
  assessments: [
    {
      id: 'a1',
      institutionName: 'Lycée des Tilleuls',
      institutionType: 'lycee',
      answers: { 'll-postes': 3, 'sd-sauvegardes': 'unknown', 'dm-deee': 'na', 'gn-politique': 0 },
      currentIndex: 7,
      createdAt: '2026-11-20T09:00:00.000Z',
      updatedAt: '2026-11-20T09:12:00.000Z',
      completedAt: null,
    },
  ],
}

test('12. saved progress is restored exactly', () => {
  const storage = memoryStorage()
  assert.equal(saveStore(storage, sample), true)
  const { store, status } = loadStore(storage)
  assert.equal(status, 'ok')
  assert.deepEqual(store, sample)
})

test('nothing stored gives an empty store', () => {
  assert.deepEqual(loadStore(memoryStorage()), { store: emptyStore(), status: 'empty' })
  assert.deepEqual(loadStore(null), { store: emptyStore(), status: 'empty' })
})

test('11. corrupted JSON does not crash and is kept aside', () => {
  const storage = memoryStorage({ [STORAGE_KEY]: '{"version":1,"assessments":[' })
  const { store, status } = loadStore(storage)
  assert.equal(status, 'recovered')
  assert.deepEqual(store, emptyStore())
  assert.equal(storage.data.get(BACKUP_KEY), '{"version":1,"assessments":[')
})

test('11. outdated or foreign schemas are rejected safely', () => {
  for (const raw of ['{"version":0,"assessments":[]}', '[]', '"texte"', 'null', '42', '{"version":1}']) {
    const { store, status } = parseStore(raw)
    assert.equal(status, 'recovered', raw)
    assert.deepEqual(store, emptyStore())
  }
})

test('11. invalid entries are dropped, valid ones kept and cleaned', () => {
  const raw = JSON.stringify({
    version: 1,
    activeId: 'disparu',
    assessments: [
      { id: '', createdAt: '2026-01-01' }, // no id
      { id: 'b', createdAt: 'pas une date' }, // bad date
      {
        id: 'c',
        createdAt: '2026-11-01T10:00:00.000Z',
        institutionType: 'château',
        institutionName: 42,
        currentIndex: 999,
        answers: { 'll-postes': 4, 'll-formats': 9, 'question-inconnue': 2, 'sd-acces': 'na', 'dm-cycle': '3' },
      },
      { id: 'c', createdAt: '2026-11-01T10:00:00.000Z' }, // duplicate id
    ],
  })
  const { store, status } = parseStore(raw)
  assert.equal(status, 'recovered')
  assert.equal(store.activeId, null)
  assert.equal(store.assessments.length, 1)
  assert.deepEqual(store.assessments[0], {
    id: 'c',
    institutionName: '',
    institutionType: null,
    answers: { 'll-postes': 4, 'sd-acces': 'na' },
    currentIndex: 19,
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
    completedAt: null,
  })
})

test('a storage that throws (privacy mode, quota) is handled', () => {
  const failing: KeyValueStorage = {
    getItem: () => {
      throw new Error('SecurityError')
    },
    setItem: () => {
      throw new Error('QuotaExceededError')
    },
  }
  assert.deepEqual(loadStore(failing), { store: emptyStore(), status: 'empty' })
  assert.equal(saveStore(failing, sample), false)
})
