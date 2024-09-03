import { NextResponse } from 'next/server'
import fetch from 'node-fetch'

export async function GET() {
  const repoOwner = 'SinLess-Games-LLC'
  const repoName = 'Helix-AI'
  const branch = 'master'
  const filePath = 'package.json'

  try {
    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${filePath}`
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch package.json' },
        { status: 500 },
      )
    }

    const packageJson = await response.json()
    const version = packageJson.version

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found in package.json' },
        { status: 404 },
      )
    }

    return NextResponse.json({ version }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch package version' },
      { status: 500 },
    )
  }
}
