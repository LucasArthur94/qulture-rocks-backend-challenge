import * as dayjs from 'dayjs'
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { Segmentation } from '../entities/segmentation.entity'

const dateQueryBuilder = (
  beforeDate?: Date,
  afterDate?: Date,
  withTime = false
) => {
  const formatString = withTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'

  if (beforeDate && afterDate) {
    return Between(
      dayjs(beforeDate).format(formatString),
      dayjs(afterDate).format(formatString)
    )
  }

  if (beforeDate) {
    return LessThanOrEqual(dayjs(beforeDate).format(formatString))
  }

  if (afterDate) {
    return MoreThanOrEqual(dayjs(afterDate).format(formatString))
  }

  return undefined
}

export const queryBuilder = (segmentation: Segmentation) => {
  const {
    birthDateBefore,
    birthDateAfter,
    admissionDateBefore,
    admissionDateAfter,
    isActive,
    sex,
    lastSignInDateBefore,
    lastSignInDateAfter,
  } = segmentation

  const birthDateQuery =
    birthDateBefore || birthDateAfter
      ? {
          birthDate: dateQueryBuilder(birthDateBefore, birthDateAfter),
        }
      : undefined

  const admissionDateQuery =
    admissionDateBefore || admissionDateAfter
      ? {
          admissionDate: dateQueryBuilder(
            admissionDateBefore,
            admissionDateAfter
          ),
        }
      : undefined

  const lastSignInDateQuery =
    lastSignInDateBefore || lastSignInDateAfter
      ? {
          lastSignInAt: dateQueryBuilder(
            lastSignInDateBefore,
            lastSignInDateAfter,
            true
          ),
        }
      : undefined

  const isActiveQuery =
    typeof isActive === 'boolean'
      ? {
          isActive,
        }
      : undefined

  const sexQuery = sex
    ? {
        sex,
      }
    : undefined

  return {
    ...birthDateQuery,
    ...admissionDateQuery,
    ...lastSignInDateQuery,
    ...isActiveQuery,
    ...sexQuery,
  }
}
