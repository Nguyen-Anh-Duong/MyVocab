export class BaseError extends Error {
  constructor(message: string, name = 'BaseError') {
    super(message)
    this.name = name
    Object.setPrototypeOf(this, new.target.prototype) // fix prototype chain in ES5
  }
}

export class UnExpectedError extends BaseError {
  constructor(message: string, name = 'UnExpectedError') {
    super(message)
    this.name = name
  }
}
