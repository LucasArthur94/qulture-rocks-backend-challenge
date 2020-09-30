import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { makeTest } from '../test-helpers'
import { dateQueryBuilder } from './date-query-builder'

const test = makeTest()

test('should return undefined when invalid dates', async (t) => {
  t.deepEqual(
    dateQueryBuilder(new Date(2020, 6, 4), new Date(2020, 7, 10)),
    undefined
  )
})

test('should validate with between', async (t) => {
  t.deepEqual(
    dateQueryBuilder(new Date(2020, 7, 10), new Date(2020, 6, 4)),
    Between('2020-07-04', '2020-08-10')
  )
})

test('should validate with between full date', async (t) => {
  t.deepEqual(
    dateQueryBuilder(new Date(2020, 7, 10), new Date(2020, 6, 4), true),
    Between('2020-07-04 00:00:00', '2020-08-10 00:00:00')
  )
})

test('should validate with more than equal', async (t) => {
  t.deepEqual(
    dateQueryBuilder(undefined, new Date(2020, 6, 4)),
    MoreThanOrEqual('2020-07-04')
  )
})

test('should validate with less than equal', async (t) => {
  t.deepEqual(
    dateQueryBuilder(new Date(2020, 7, 10)),
    LessThanOrEqual('2020-08-10')
  )
})

test('should return undefined otherwise', async (t) => {
  t.deepEqual(dateQueryBuilder(), undefined)
})
