import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { randomUUID } from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = req.body
    const file = form?.file

    if (!file) {
      return res.status(400).json({ error: 'File is required' })
    }

    // تبدیل Buffer به Uint8Array
    const buffer = Buffer.from(file.data)
    const ext = file.filename.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${randomUUID()}.${ext}`

    const dir = path.join(process.cwd(), 'public', 'uploads', 'stories')
    await fs.mkdir(dir, { recursive: true })
    const filepath = path.join(dir, filename)

    // استفاده از Uint8Array برای نوشتن فایل
    await fs.writeFile(filepath, new Uint8Array(buffer))

    // بروزرسانی فایل stories.json
    const storiesJsonPath = path.join(process.cwd(), 'public', 'uploads', 'stories', 'stories.json')
    let stories = []

    try {
      const rawData = await fs.readFile(storiesJsonPath, 'utf-8')
      stories = JSON.parse(rawData)
    } catch (error) {
      // اگر فایل وجود ندارد یا خالی است، آرایه خالی ایجاد می‌شود
    }

    const newStory = {
      id: randomUUID(),
      url: `/uploads/stories/${filename}`,
      createdAt: new Date().toISOString(),
    }
    stories.push(newStory)

    await fs.writeFile(storiesJsonPath, JSON.stringify(stories, null, 2))

    return res.status(200).json({ url: `/uploads/stories/${filename}` })
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
}
