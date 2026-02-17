import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

// Load .env from monorepo root
config({ path: path.resolve(__dirname, '../../.env') })

export default defineConfig({
  schema: 'prisma/',
})
