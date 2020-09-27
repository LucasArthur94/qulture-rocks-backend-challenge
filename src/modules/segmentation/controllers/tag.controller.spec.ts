import { stub } from 'sinon'
import { Test, TestingModule } from '@nestjs/testing'
import { TagController } from './tag.controller'
import { getMockProviders, makeTest } from '../test-helpers'

const test = makeTest<{
  controller: TagController
}>()

test.beforeEach(async (t) => {
  const app: TestingModule = await Test.createTestingModule({
    controllers: [TagController],
    providers: getMockProviders(t.context.reposMock),
  }).compile()

  t.context.controller = app.get<TagController>(TagController)
})

test('should return tags', async (t) => {
  t.context.reposMock.tag.find = stub().resolves([
    {
      id: 1,
      name: 'Marketing',
      users: [],
      userIds: [],
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    },
  ])

  t.deepEqual(await t.context.controller.getTags(), {
    tags: [
      {
        id: 1,
        name: 'Marketing',
        users: [],
        userIds: [],
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      },
    ],
  })
})

test('should return tag', async (t) => {
  t.context.reposMock.tag.findOne = stub().resolves({
    id: 1,
    name: 'Marketing',
    users: [],
    userIds: [],
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  })

  t.deepEqual(await t.context.controller.getTag('1'), {
    tag: {
      id: 1,
      name: 'Marketing',
      users: [],
      userIds: [],
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    },
  })
})

test('should create tag', async (t) => {
  t.context.reposMock.tag.save = stub().resolves({
    id: 1,
    name: 'Marketing',
    users: [],
    userIds: [],
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  })

  t.deepEqual(await t.context.controller.createTag({ name: 'Marketing' }), {
    tag: {
      id: 1,
      name: 'Marketing',
      users: [],
      userIds: [],
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    },
  })
})

test('should update tag', async (t) => {
  t.context.reposMock.tag.findOne = stub()

  t.context.reposMock.tag.findOne.withArgs(1).resolves({
    id: 1,
    name: 'Marketing',
    users: [],
    userIds: [],
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  })

  t.context.reposMock.tag.findOne
    .withArgs({
      where: { name: 'Marketing New' },
    })
    .resolves()

  t.context.reposMock.tag.save = stub().resolves({
    id: 1,
    name: 'Marketing New',
    users: [],
    userIds: [],
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  })

  t.deepEqual(
    await t.context.controller.editTag({ id: 1, name: 'Marketing New' }),
    {
      tag: {
        id: 1,
        name: 'Marketing New',
        users: [],
        userIds: [],
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      },
    }
  )
})

test('should return tag if already exists', async (t) => {
  t.context.reposMock.tag.findOne = stub()
  t.context.reposMock.tag.save = stub()

  t.context.reposMock.tag.findOne.withArgs(1).resolves({
    id: 1,
    name: 'Marketing',
    users: [],
    userIds: [],
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  })

  t.context.reposMock.tag.findOne
    .withArgs({
      where: { name: 'Marketing New' },
    })
    .resolves({
      id: 2,
      name: 'Marketing New',
      users: [],
      userIds: [],
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    })

  t.deepEqual(
    await t.context.controller.editTag({ id: 1, name: 'Marketing New' }),
    {
      tag: {
        id: 2,
        name: 'Marketing New',
        users: [],
        userIds: [],
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      },
    }
  )

  t.false(t.context.reposMock.tag.save.called)
})

test('should delete tag', async (t) => {
  t.context.reposMock.tag.delete = stub().resolves()

  t.deepEqual(await t.context.controller.deleteTag({ id: 1 }), {
    success: true,
  })

  t.true(t.context.reposMock.tag.delete.calledWith(1))
})
