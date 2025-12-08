import crypto from 'crypto'

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export { generateVerificationToken, generateResetToken }
