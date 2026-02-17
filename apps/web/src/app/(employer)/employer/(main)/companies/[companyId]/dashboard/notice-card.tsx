import { Card, CardContent } from '@jobpop/ui'

export async function NoticeCard() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  return (
    <Card>
      <CardContent>Notice</CardContent>
    </Card>
  )
}
