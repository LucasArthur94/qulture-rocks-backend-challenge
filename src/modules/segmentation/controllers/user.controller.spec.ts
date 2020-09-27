import { stub } from 'sinon'
import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { getMockProviders, makeTest } from '../test-helpers'

const test = makeTest<{
  controller: UserController
}>()

test.beforeEach(async (t) => {
  const app: TestingModule = await Test.createTestingModule({
    controllers: [UserController],
    providers: getMockProviders(t.context.reposMock),
  }).compile()

  t.context.controller = app.get<UserController>(UserController)
})

test('should return users', async (t) => {
  t.context.reposMock.user.find = stub().resolves([
    {
      id: 1,
      email: 'main@qulturerocks.com',
      firstName: 'Qulture',
      lastName: 'Rocks',
      birthDate: new Date(2020, 1, 1),
      admissionDate: new Date(2020, 1, 1),
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

  t.deepEqual(await t.context.controller.getUsers(), {
    users: [
      {
        id: 1,
        email: 'main@qulturerocks.com',
        firstName: 'Qulture',
        lastName: 'Rocks',
        birthDate: new Date(2020, 1, 1),
        admissionDate: new Date(2020, 1, 1),
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

test('should return user', async (t) => {
  t.context.reposMock.user.findOne = stub().resolves({
    id: 1,
    email: 'main@qulturerocks.com',
    firstName: 'Qulture',
    lastName: 'Rocks',
    birthDate: new Date(2020, 1, 1),
    admissionDate: new Date(2020, 1, 1),
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
  })

  t.deepEqual(await t.context.controller.getUser('1'), {
    user: {
      id: 1,
      email: 'main@qulturerocks.com',
      firstName: 'Qulture',
      lastName: 'Rocks',
      birthDate: new Date(2020, 1, 1),
      admissionDate: new Date(2020, 1, 1),
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
  })
})

test('should create user', async (t) => {
  t.context.reposMock.tag.findByIds = stub()
    .withArgs([3])
    .resolves([
      {
        id: 3,
        name: 'Tech',
        userIds: [],
        users: [],
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      },
    ])

  t.context.reposMock.user.save = stub().resolves({
    id: 1,
    email: 'main@qulturerocks.com',
    firstName: 'Qulture',
    lastName: 'Rocks',
    birthDate: new Date(2020, 1, 1),
    admissionDate: new Date(2020, 1, 1),
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
  })

  t.deepEqual(
    await t.context.controller.createUser({
      email: 'main@qulturerocks.com',
      firstName: 'Qulture',
      lastName: 'Rocks',
      birthDate: new Date(2020, 1, 1),
      admissionDate: new Date(2020, 1, 1),
      isActive: true,
      sex: 'male',
      lastSignInAt: new Date(2020, 1, 1),
      tagIds: [3],
    }),
    {
      user: {
        id: 1,
        email: 'main@qulturerocks.com',
        firstName: 'Qulture',
        lastName: 'Rocks',
        birthDate: new Date(2020, 1, 1),
        admissionDate: new Date(2020, 1, 1),
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
    }
  )
})

test('should update user', async (t) => {
  t.context.reposMock.user.findOne = stub().resolves({
    id: 1,
    email: 'main@qulturerocks.com',
    firstName: 'Qulture',
    lastName: 'Rocks',
    birthDate: new Date(2020, 1, 1),
    admissionDate: new Date(2020, 1, 1),
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
  })

  t.context.reposMock.tag.findByIds = stub().withArgs([]).resolves([])

  t.context.reposMock.user.save = stub().resolves({
    id: 1,
    email: 'main@qulturerocks.com',
    firstName: 'Lucas',
    lastName: 'Arthur',
    birthDate: new Date(2020, 1, 1),
    admissionDate: new Date(2020, 1, 1),
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
  })

  t.deepEqual(
    await t.context.controller.editUser({
      id: 1,
      firstName: 'Lucas',
      lastName: 'Arthur',
    }),
    {
      user: {
        id: 1,
        email: 'main@qulturerocks.com',
        firstName: 'Lucas',
        lastName: 'Arthur',
        birthDate: new Date(2020, 1, 1),
        admissionDate: new Date(2020, 1, 1),
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
    }
  )
})

test('should delete user', async (t) => {
  t.context.reposMock.user.delete = stub().resolves()

  t.deepEqual(await t.context.controller.deleteUser({ id: 1 }), {
    success: true,
  })

  t.true(t.context.reposMock.user.delete.calledWith(1))
})
