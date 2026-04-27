import { defineConfig } from 'prisma/config'
import dotenv from 'dotenv'
import path from 'path'

// Carregar variáveis manualmente já que o Prisma 6 pula o carregamento automático quando há config file
dotenv.config({ path: path.join(process.cwd(), '.env.local') })
dotenv.config({ path: path.join(process.cwd(), '.env') })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
    directUrl: process.env.DIRECT_URL!
  }
})
