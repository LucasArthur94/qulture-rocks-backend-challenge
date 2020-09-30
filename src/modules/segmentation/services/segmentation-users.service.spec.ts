import { stub } from 'sinon'
import { Test, TestingModule } from '@nestjs/testing'
import { getMockProviders, makeTest } from '../test-helpers'
import { SegmentationUsersService } from '../services/segmentation-users.service'
import { Segmentation } from '../entities/segmentation.entity'
import { Between } from 'typeorm'

const test = makeTest<{
  provider: SegmentationUsersService
}>()

test.beforeEach(async (t) => {
  const app: TestingModule = await Test.createTestingModule({
    providers: [
      ...getMockProviders(t.context.reposMock),
      SegmentationUsersService,
    ],
  }).compile()

  t.context.provider = app.get<SegmentationUsersService>(
    SegmentationUsersService
  )
})

test('should find users of a single segmentation', async (t) => {
  const segmentation = { isActive: true } as Segmentation

  t.context.reposMock.user.find = stub()
    .withArgs({ isActive: true })
    .resolves([
      {
        id: 1,
        email: 'main@qulturerocks.com',
        firstName: 'Lucas',
        lastName: 'Arthur',
        birthDate: new Date(2020, 1, 1),
        admissionDate: new Date(2016, 7, 4),
        isActive: true,
        sex: 'male',
        lastSignInAt: new Date(2020, 1, 1),
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
        tagIds: [3],
        tags: [
          {
            id: 3,
            name: 'Tech',
            userIds: [],
            users: [],
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2020, 1, 1),
          },
        ],
      },
    ])

  t.deepEqual(await t.context.provider.getSegmentationUsers(segmentation), [
    {
      id: 1,
      email: 'main@qulturerocks.com',
      firstName: 'Lucas',
      lastName: 'Arthur',
      birthDate: new Date(2020, 1, 1),
      admissionDate: new Date(2016, 7, 4),
      isActive: true,
      sex: 'male',
      lastSignInAt: new Date(2020, 1, 1),
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
      tagIds: [3],
      tags: [
        {
          id: 3,
          name: 'Tech',
          userIds: [],
          users: [],
          createdAt: new Date(2020, 1, 1),
          updatedAt: new Date(2020, 1, 1),
        },
      ],
    },
  ])
})

test('should get active users with admission date between 2016 and 2017 and Tech area', async (t) => {
  const segmentation = {
    admissionDateBefore: new Date('2017-1-1'),
    admissionDateAfter: new Date('2016-1-1'),
    tagId: 3,
  } as Segmentation

  t.context.reposMock.user.find = stub()
    .withArgs({ admissionDate: Between('2016-01-01', '2017-01-01') })
    .resolves([
      {
        id: 1,
        email: 'main@qulturerocks.com',
        firstName: 'Lucas',
        lastName: 'Arthur',
        birthDate: new Date(2020, 1, 1),
        admissionDate: new Date(2016, 7, 4),
        isActive: true,
        sex: 'male',
        lastSignInAt: new Date(2020, 1, 1),
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
        tagIds: [3],
        tags: [
          {
            id: 3,
            name: 'Tech',
            userIds: [],
            users: [],
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2020, 1, 1),
          },
        ],
      },
    ])

  t.deepEqual(await t.context.provider.getSegmentationUsers(segmentation), [
    {
      id: 1,
      email: 'main@qulturerocks.com',
      firstName: 'Lucas',
      lastName: 'Arthur',
      birthDate: new Date(2020, 1, 1),
      admissionDate: new Date(2016, 7, 4),
      isActive: true,
      sex: 'male',
      lastSignInAt: new Date(2020, 1, 1),
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
      tagIds: [3],
      tags: [
        {
          id: 3,
          name: 'Tech',
          userIds: [],
          users: [],
          createdAt: new Date(2020, 1, 1),
          updatedAt: new Date(2020, 1, 1),
        },
      ],
    },
  ])
})
