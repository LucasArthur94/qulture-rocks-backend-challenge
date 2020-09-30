import { SinonStub, stub } from 'sinon'
import { Test, TestingModule } from '@nestjs/testing'
import { SegmentationController } from './segmentation.controller'
import { getMockProviders, makeTest } from '../test-helpers'
import { SegmentationUsersService } from '../services/segmentation-users.service'

const test = makeTest<{
  controller: SegmentationController
  segmentationServiceMock: {
    getSegmentationUsers: SinonStub
  }
}>()

test.beforeEach(async (t) => {
  t.context.segmentationServiceMock = {
    getSegmentationUsers: stub(),
  }

  const app: TestingModule = await Test.createTestingModule({
    controllers: [SegmentationController],
    providers: [
      ...getMockProviders(t.context.reposMock),
      {
        provide: SegmentationUsersService,
        useValue: t.context.segmentationServiceMock,
      },
    ],
  }).compile()

  t.context.controller = app.get<SegmentationController>(SegmentationController)
})

test('should create a single segmentation', async (t) => {
  t.context.reposMock.segmentation.save = stub()

  t.context.reposMock.segmentation.save
    .withArgs({
      admissionDateBefore: new Date(2016, 1, 1),
      admissionDateAfter: new Date(2016, 12, 31),
    })
    .resolves({
      id: 1,
      admissionDateBefore: new Date(2016, 1, 1),
      admissionDateAfter: new Date(2016, 12, 31),
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    })

  t.deepEqual(
    await t.context.controller.createSegmentations({
      segmentations: [
        {
          admissionDateBefore: new Date(2016, 1, 1),
          admissionDateAfter: new Date(2016, 12, 31),
        },
      ],
    }),
    {
      segmentationId: 1,
    }
  )
})

test('should get a segmentation', async (t) => {
  t.context.reposMock.segmentation.findOne = stub().resolves({
    id: 1,
    admissionDateBefore: new Date(2016, 1, 1),
    admissionDateAfter: new Date(2016, 12, 31),
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  })

  t.deepEqual(await t.context.controller.getSegmentation('1'), {
    segmentation: {
      id: 1,
      admissionDateBefore: new Date(2016, 1, 1),
      admissionDateAfter: new Date(2016, 12, 31),
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    },
  })
})

test('should get active users with admission date between 2016 and 2017', async (t) => {
  t.context.reposMock.segmentation.find = stub()
    .withArgs([{ id: 1 }, { parentSegmentation: { id: 1 } }])
    .resolves([
      {
        id: 1,
        isActive: true,
        admissionDateBefore: new Date(2016, 1, 1),
        admissionDateAfter: new Date(2016, 12, 31),
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      },
    ])

  t.context.segmentationServiceMock.getSegmentationUsers = stub()
    .withArgs({
      id: 1,
      isActive: true,
      admissionDateBefore: new Date(2016, 1, 1),
      admissionDateAfter: new Date(2016, 12, 31),
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    })
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

  t.deepEqual(await t.context.controller.getUsers('1'), {
    users: [
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
    ],
  })
})

test('should get male Marketing users or female Sales users', async (t) => {
  t.context.reposMock.segmentation.find = stub()
    .withArgs([{ id: 1 }, { parentSegmentation: { id: 1 } }])
    .resolves([
      {
        id: 1,
        sex: 'male',
        tagId: 1,
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      },
      {
        id: 2,
        sex: 'female',
        tagId: 2,
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
        parentSegmentation: {
          id: 1,
          sex: 'male',
          tagId: 1,
          createdAt: new Date(2020, 1, 1),
          updatedAt: new Date(2020, 1, 1),
        },
      },
    ])

  t.context.segmentationServiceMock.getSegmentationUsers = stub()
    .withArgs({
      id: 1,
      sex: 'male',
      tagId: 1,
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    })
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
        tagIds: [1],
        tags: [
          {
            id: 1,
            name: 'Marketing',
            userIds: [],
            users: [],
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2020, 1, 1),
          },
        ],
      },
    ])

  t.context.segmentationServiceMock.getSegmentationUsers = stub()
    .withArgs({
      id: 2,
      sex: 'female',
      tagId: 2,
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
      parentSegmentation: {
        id: 1,
        sex: 'male',
        tagId: 1,
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      },
    })
    .resolves([
      {
        id: 2,
        email: 'master@qulturerocks.com',
        firstName: 'Maria',
        lastName: 'Eduarda',
        birthDate: new Date(2020, 1, 1),
        admissionDate: new Date(2016, 7, 4),
        isActive: true,
        sex: 'female',
        lastSignInAt: new Date(2020, 1, 1),
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
        tagIds: [2],
        tags: [
          {
            id: 2,
            name: 'Sales',
            userIds: [],
            users: [],
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2020, 1, 1),
          },
        ],
      },
    ])

  t.deepEqual(await t.context.controller.getUsers('1'), {
    users: [
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
        tagIds: [1],
        tags: [
          {
            id: 1,
            name: 'Marketing',
            userIds: [],
            users: [],
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2020, 1, 1),
          },
        ],
      },
      {
        id: 2,
        email: 'master@qulturerocks.com',
        firstName: 'Maria',
        lastName: 'Eduarda',
        birthDate: new Date(2020, 1, 1),
        admissionDate: new Date(2016, 7, 4),
        isActive: true,
        sex: 'female',
        lastSignInAt: new Date(2020, 1, 1),
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
        tagIds: [2],
        tags: [
          {
            id: 2,
            name: 'Sales',
            userIds: [],
            users: [],
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2020, 1, 1),
          },
        ],
      },
    ],
  })
})
