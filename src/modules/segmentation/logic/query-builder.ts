import { FindOperator } from 'typeorm'
import { Segmentation } from '../entities/segmentation.entity'
import { dateQueryBuilder } from './date-query-builder'

type Query = {
  sex?: 'male' | 'female'
  isActive?: boolean
  lastSignInAt?: FindOperator<any> | undefined
  admissionDate?: FindOperator<any> | undefined
  birthDate?: FindOperator<any> | undefined
}

export const queryBuilder = (segmentation: Segmentation): Query => {
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
