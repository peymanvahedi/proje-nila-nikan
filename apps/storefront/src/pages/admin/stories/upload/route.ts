import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  if (req.headers.get("x-admin-key") !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get("file") as File | null
  if (!file) return NextResponse.json({ error: "file required" }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
  const filename = `${Date.now()}-${randomUUID()}.${ext}`

  const dir = path.join(process.cwd(), "public", "uploads", "stories")
  await fs.mkdir(dir, { recursive: true })
  const filepath = path.join(dir, filename)

  // Write the file to the uploads folder
  await fs.writeFile(filepath, new Uint8Array(buffer))

  // Update the stories.json file with the new story
  const storiesJsonPath = path.join(process.cwd(), "public", "uploads", "stories", "stories.json")
  let stories = []

  // Read the existing stories from the JSON file if it exists
  try {
    const rawData = await fs.readFile(storiesJsonPath, "utf-8")
    stories = JSON.parse(rawData)
  } catch (error) {
    // If the file doesn't exist or is empty, create an empty array
  }

  // Add the new story to the array
  const newStory = {
    id: randomUUID(),
    url: `/uploads/stories/${filename}`,
    createdAt: new Date().toISOString()
  }
  stories.push(newStory)

  // Write the updated stories array back to the stories.json file
  await fs.writeFile(storiesJsonPath, JSON.stringify(stories, null, 2))

  return NextResponse.json({ url: `/uploads/stories/${filename}` })
}
