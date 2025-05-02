import { randomBytes, scrypt } from 'node:crypto'
import { KEY_LENGTH, SALT_LENGTH } from '~/config/index.js'

const generateSalt = (length: number): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    randomBytes(length, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf)
      }
    })
  })
}

export const hashPassword = async (password: string): Promise<Buffer> => {
  const salt = await generateSalt(SALT_LENGTH)
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) {
        return reject(err)
      }
      resolve(Buffer.concat([salt, derivedKey]))
    })
  })
}

export const comparePassword = async (password: string, passwordHash: Buffer): Promise<boolean> => {
  const salt = passwordHash.subarray(0, SALT_LENGTH)
  const storedHash = passwordHash.subarray(SALT_LENGTH)
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey as Buffer)
    })
  })
  return Buffer.compare(derivedKey, storedHash) === 0
}
