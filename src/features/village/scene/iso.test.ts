import assert from 'node:assert/strict'
import { test } from 'node:test'
import { compareDepth, project, toPercent } from './iso.ts'

test('project maps the ground grid to a 2:1 diamond and lifts with height', () => {
  assert.deepEqual(project(0, 0), [0, 0])
  assert.deepEqual(project(1, 0), [32, 16])
  assert.deepEqual(project(0, 1), [-32, 16])
  assert.deepEqual(project(1, 1, 1), [0, -4])
})

test('toPercent places viewBox corners at 0% and 100%', () => {
  const view = { x: -32, y: 0, width: 64, height: 32 }
  assert.deepEqual(toPercent(view, 0, 1), { left: 0, top: 50 })
  assert.deepEqual(toPercent(view, 1, 0), { left: 100, top: 50 })
})

test('compareDepth draws objects behind first', () => {
  const back = { x: 0, y: 0, w: 2, d: 2 }
  const right = { x: 3, y: 0, w: 1, d: 1 }
  const front = { x: 0, y: 3, w: 1, d: 1 }
  assert.ok(compareDepth(back, right) < 0)
  assert.ok(compareDepth(front, back) > 0)
  const sorted = [front, right, back].sort(compareDepth)
  assert.equal(sorted[0], back)
})
