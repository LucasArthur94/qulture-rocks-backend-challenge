import * as clc from 'cli-color'
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import {
  LoggerService,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose'

const isObject = (val: any) => val !== null && typeof val === 'object'

const colors = {
  log: clc.green,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
}

type Message = Record<string, unknown> | string

export class Logger implements LoggerService {
  private static lastTimestamp?: number
  protected context?: string

  setContext(context: string) {
    this.context = context
  }

  error(message: Message, trace = '', context?: string) {
    this.printMessage('error', message, context)
    this.printStackTrace(trace)
  }

  log(message: Message, context?: string) {
    this.printMessage('log', message, context)
  }

  warn(message: Message, context?: string) {
    this.printMessage('warn', message, context)
  }

  debug(message: Message, context?: string) {
    this.printMessage('debug', message, context)
  }

  verbose(message: Message, context?: string) {
    this.printMessage('verbose', message, context)
  }

  private printMessage(level: LogLevel, payload: any, context = '') {
    if (process.env.NODE_ENV === 'dev') {
      return this.printInDevMode(level, payload, context)
    }

    this.printInProdMode(level, payload, context)
  }

  private printInDevMode(level: LogLevel, payload: any, context = '') {
    const timestampDiff = this.updateAndGetTimestampDiff()
    const contextMessage = context ? clc.xterm(245)(`[${context}] `) : ''

    const color = colors[level]

    const { message, ...rest } = this.payloadToObject(payload)

    process.stdout.write(
      `${color(level.padEnd(7))} ${contextMessage}${message}${timestampDiff}\n`
    )

    if (Object.keys(rest).length) {
      process.stdout.write(
        `${clc.xterm(245)(JSON.stringify(rest, null, 2))}\n\n`
      )
    }
  }

  private printInProdMode(level: LogLevel, payload: any, context = '') {
    const output = this.payloadToObject(payload)

    output.timestamp = new Date().toISOString()
    output.context = context
    output.level = level

    if (level === 'verbose') {
      console.log(JSON.stringify(output))
      return
    }

    console[level](JSON.stringify(output))
  }

  private payloadToObject(payload: any) {
    if (isObject(payload)) {
      const { msg, ...rest } = payload
      return {
        ...rest,
        message: msg,
      }
    }

    return {
      message: payload,
    }
  }

  private updateAndGetTimestampDiff(): string {
    const result = Logger.lastTimestamp
      ? clc.xterm(245)(` +${Date.now() - Logger.lastTimestamp}ms`)
      : ''
    Logger.lastTimestamp = Date.now()
    return result
  }

  private printStackTrace(trace: string) {
    if (!trace) {
      return
    }
    process.stdout.write(`${trace}\n\n`)
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger()

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isRpc = !!context.switchToRpc().getContext()?.fields?.routingKey

    if (isRpc) {
      return this.interceptRpc(context, next)
    }

    return this.interceptHttp(context, next)
  }

  interceptHttp(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()

    this.logger.debug({
      msg: `Request: ${req.method} - ${req.originalUrl}`,
      ...req.body,
    })

    const now = Date.now()

    return next
      .handle()
      .pipe(
        tap((response) => {
          this.logger.debug({
            msg: `Response: ${req.method} - ${req.originalUrl}`,
            executionTime: Date.now() - now,
            response,
          })
        })
      )
      .pipe(
        catchError((error) => {
          this.logger.error(
            {
              msg: `ResponseError: ${req.method} - ${req.originalUrl}`,
              executionTime: Date.now() - now,
              error,
            },
            error.stack ? error.stack : error
          )

          return throwError(error)
        })
      )
  }

  interceptRpc(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpc = context.switchToRpc()
    const { fields } = rpc.getContext()

    const name = `${fields.exchange} - ${fields.routingKey}`

    this.logger.debug({
      msg: `MessageReceived: ${name}`,
      body: rpc.getData(),
    })

    const now = Date.now()

    return next
      .handle()
      .pipe(
        tap((response) => {
          this.logger.debug({
            msg: `MessageProcessed: ${name}`,
            executionTime: Date.now() - now,
            response,
          })
        })
      )
      .pipe(
        catchError((error) => {
          this.logger.error(
            {
              msg: `MessageError: ${name}`,
              executionTime: Date.now() - now,
              error,
            },
            error.stack ? error.stack : error
          )

          return throwError(error)
        })
      )
  }
}
