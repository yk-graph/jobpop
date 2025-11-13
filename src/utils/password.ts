import { hash, compare } from 'bcryptjs'

const saltRounds = 10

async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    console.error('Error hashing password:', error)
    throw error
  }
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isMatch = await compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    console.error('Error comparing password:', error)
    throw error
  }
}

export { hashPassword, verifyPassword }
