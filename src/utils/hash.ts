import { randomBytes, scrypt } from 'node:crypto'
import { UnExpectedError } from './Errors.js'

const generateSalt = (length: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    randomBytes(length, (err, buf) => {
      if (err) {
        reject(new UnExpectedError(err.message))
      } else {
        resolve(buf.toString('hex'))
      }
    })
  })
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await generateSalt(16)
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        return reject(new UnExpectedError(err.message))
      }
      resolve(`${salt}${derivedKey.toString('hex')}`)
    })
  })
}
