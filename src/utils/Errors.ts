export abstract class CustomError extends Error {
  abstract readonly statusCode: number
  abstract readonly errors: CustomErrorContent[]
  abstract readonly logging: boolean

  constructor(message: string) {
    super(message)

    // fix prototype chain in ES5
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class BadRequestError extends CustomError {
  private static readonly statusCode = 400
  private _code: number
  private _logging: boolean
  private _context: { [key: string]: any }

  constructor(params?: { code?: number; message?: string; logging?: boolean; context?: { [key: string]: any } }) {
    const { code, message, logging } = params || {}

    super(message || 'Bad request')
    this._code = code || BadRequestError.statusCode
    this._logging = logging || false
    this._context = params?.context || {}
  }

  get errors() {
    return [{ message: this.message, context: this._context }]
  }

  get statusCode() {
    return this._code
  }

  get logging() {
    return this._logging
  }
}

export class NotFoundError extends CustomError {
  private static readonly statusCode = 404
  private _code: number
  private _logging: boolean
  private _context: { [key: string]: any }

  constructor(params?: { code?: number; message?: string; logging?: boolean; context?: { [key: string]: any } }) {
    const { code, message, logging } = params || {}

    super(message || 'Not found resource')
    this._code = code || NotFoundError.statusCode
    this._logging = logging || false
    this._context = params?.context || {}
  }

  get errors() {
    return [{ message: this.message, context: this._context }]
  }

  get statusCode() {
    return this._code
  }

  get logging() {
    return this._logging
  }
}

export class UnauthorizedError extends CustomError {
  private static readonly statusCode = 401
  private _code: number
  private _logging: boolean
  private _context: { [key: string]: any }

  constructor(params?: { code?: number; message?: string; logging?: boolean; context?: { [key: string]: any } }) {
    const { code, message, logging } = params || {}

    super(message || 'Unauthorized')
    this._code = code || UnauthorizedError.statusCode
    this._logging = logging || false
    this._context = params?.context || {}
  }

  get errors() {
    return [{ message: this.message, context: this._context }]
  }

  get statusCode() {
    return this._code
  }

  get logging() {
    return this._logging
  }
}

export class ValidationError extends CustomError {
  private static readonly statusCode = 422
  private _code: number
  private _logging: boolean
  private _context: { [key: string]: any }

  constructor(params?: { code?: number; message?: string; logging?: boolean; context?: { [key: string]: any } }) {
    const { code, message, logging } = params || {}

    super(message || 'Validate error.')
    this._code = code || ValidationError.statusCode
    this._logging = logging || false
    this._context = params?.context || {}
  }

  get errors() {
    return [{ message: this.message, context: this._context }]
  }

  get statusCode() {
    return this._code
  }

  get logging() {
    return this._logging
  }
}

export class ForbiddenError extends CustomError {
  private static readonly statusCode = 403
  private _code: number
  private _logging: boolean
  private _context: { [key: string]: any }

  constructor(params?: { code?: number; message?: string; logging?: boolean; context?: { [key: string]: any } }) {
    const { code, message, logging } = params || {}

    super(message || 'No permission')
    this._code = code || ForbiddenError.statusCode
    this._logging = logging || false
    this._context = params?.context || {}
  }

  get errors() {
    return [{ message: this.message, context: this._context }]
  }

  get statusCode() {
    return this._code
  }

  get logging() {
    return this._logging
  }
}

export class TooManyRequestsError extends CustomError {
  private static readonly statusCode = 403
  private _code: number
  private _logging: boolean
  private _context: { [key: string]: any }

  constructor(params?: { code?: number; message?: string; logging?: boolean; context?: { [key: string]: any } }) {
    const { code, message, logging } = params || {}

    super(message || 'Too many request')
    this._code = code || TooManyRequestsError.statusCode
    this._logging = logging || false
    this._context = params?.context || {}
  }

  get errors() {
    return [{ message: this.message, context: this._context }]
  }

  get statusCode() {
    return this._code
  }

  get logging() {
    return this._logging
  }
}
