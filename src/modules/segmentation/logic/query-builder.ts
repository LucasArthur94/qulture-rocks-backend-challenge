import * as dayjs from 'dayjs'
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { Segmentation } from '../entities/segmentation.entity'

const dateQueryBuilder = (beforeDate?: Date, afterDate?: Date) => {
  if (beforeDate && afterDate) {
    return Between(
      dayjs(beforeDate).format('YYYY-MM-DD HH:mm:ss'),
      dayjs(afterDate).format('YYYY-MM-DD HH:mm:ss')
    )
  }

  if (beforeDate) {
    return MoreThanOrEqual(dayjs(beforeDate).format('YYYY-MM-DD HH:mm:ss'))
  }

  if (afterDate) {
    return LessThanOrEqual(dayjs(afterDate).format('YYYY-MM-DD HH:mm:ss'))
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
          lastSignInDate: dateQueryBuilder(
            lastSignInDateBefore,
            lastSignInDateAfter
          ),
        }
      : undefined

  const isActiveQuery =
    isActive !== undefined
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
