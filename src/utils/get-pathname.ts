'use server'

import { headers } from 'next/headers'

export async function getPathname(): Promise<string> {
  const headersList = await headers()
  return headersList.get('x-pathname') || '/'
}
