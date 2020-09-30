import ava, { TestInterface } from 'ava'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as sinon from 'sinon'
import { Repository } from 'typeorm'
import { Segmentation } from './entities/segmentation.entity'
import { User } from './entities/user.entity'
import { Tag } from './entities/tag.entity'
import { SegmentationUsersService } from './services/segmentation-users.service'

type RepoMock<T> = {
  [key in keyof Repository<T>]: sinon.SinonStub
}

const makeReposMock = () => {
  return {
    segmentation: {} as RepoMock<Tag>,
    user: {} as RepoMock<User>,
    tag: {} as RepoMock<Tag>,
  }
}

type ReposMock = ReturnType<typeof makeReposMock>

export const getMockProviders = (repos: ReposMock) => {
  return [
    {
      provide: 'Logger',
      useValue: {
        log: sinon.stub(),
        error: sinon.stub(),
        warn: sinon.stub(),
        debug: sinon.stub(),
        verbose: sinon.stub(),
        setContext: sinon.stub(),
      },
    },
    {
      provide: getRepositoryToken(User),
      useValue: repos.user,
    },
    {
      provide: getRepositoryToken(Tag),
      useValue: repos.tag,
    },
    {
      provide: getRepositoryToken(Segmentation),
      useValue: repos.segmentation,
    },
  ]
}

type TestContext<Ctx> = TestInterface<
  Ctx & {
    reposMock: ReposMock
  }
>

export const makeTest = <Ctx = Record<string, unknown>>(): TestContext<Ctx> => {
  const test = ava as TestContext<Ctx>

  test.beforeEach((t) => {
    t.context.reposMock = makeReposMock()
  })

  return test
}
