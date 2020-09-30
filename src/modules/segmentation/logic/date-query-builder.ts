import dayjs = require('dayjs')
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm'

export const dateQueryBuilder = (
  beforeDate?: Date,
  afterDate?: Date,
  withTime = false
): FindOperator<any> | undefined => {
  const formatString = withTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'

  if (beforeDate && afterDate) {
    if (dayjs(afterDate).isAfter(dayjs(beforeDate))) {
      return undefined
    }

    return Between(
      dayjs(afterDate).format(formatString),
      dayjs(beforeDate).format(formatString)
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
