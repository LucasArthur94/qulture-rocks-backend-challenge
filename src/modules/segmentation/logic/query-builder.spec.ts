import { Between, MoreThanOrEqual } from 'typeorm'
import { Segmentation } from '../entities/segmentation.entity'
import { makeTest } from '../test-helpers'
import { queryBuilder } from './query-builder'

const test = makeTest()

test('should create a empty query', async (t) => {
  const mockedSegmentation = {} as Segmentation

  t.deepEqual(queryBuilder(mockedSegmentation), {})
})

test('should create a query with dates', async (t) => {
  const mockedSegmentation = {
    birthDateBefore: new Date(2020, 7, 10),
    birthDateAfter: new Date(2020, 6, 4),
  } as Segmentation

  t.deepEqual(queryBuilder(mockedSegmentation), {
    birthDate: Between('2020-07-04', '2020-08-10'),
  })
})

test('should create a query with single date and sex', async (t) => {
  const mockedSegmentation = {
    lastSignInDateAfter: new Date(2020, 7, 10),
    sex: 'male',
  } as Segmentation

  t.deepEqual(queryBuilder(mockedSegmentation), {
    lastSignInAt: MoreThanOrEqual('2020-08-10 00:00:00'),
    sex: 'male',
  })
})

test('should create a complete query', async (t) => {
  const mockedSegmentation = {
    birthDateBefore: new Date(2020, 7, 10),
    birthDateAfter: new Date(2020, 6, 4),
    admissionDateBefore: new Date(2020, 7, 10),
    admissionDateAfter: new Date(2020, 6, 4),
    lastSignInDateBefore: new Date(2020, 7, 10),
    lastSignInDateAfter: new Date(2020, 6, 4),
    sex: 'male',
    isActive: true,
  } as Segmentation

  t.deepEqual(queryBuilder(mockedSegmentation), {
    birthDate: Between('2020-07-04', '2020-08-10'),
    admissionDate: Between('2020-07-04', '2020-08-10'),
    lastSignInAt: Between('2020-07-04 00:00:00', '2020-08-10 00:00:00'),
    sex: 'male',
    isActive: true,
  })
})
