import { NextResponse } from 'next/server'
import JSON5 from 'json5'

export async function GET() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/SinLess-Games-LLC/Helix-AI/master/versions.config.json5',
    )

    if (!response.ok) {
      throw new Error('Failed to fetch versions.config.json5')
    }

    const textData = await response.text() // Use text instead of json
    const data = JSON5.parse(textData) // Parse with JSON5

    const responseData = {
      name: 'Helix AI API',
      description: 'Frontend API for Helix AI',
      version: `${data.helixApplicationVersion}`,
      appVersion: `${data.helixApiVersions.helixWebsiteBack}`,
      metadata: {
        owner: {
          name: 'SinLess-Games-LLC',
          website: 'https://sinlessgamesllc.com',
        },
        license: 'MIT',
        repository: 'https://github.com/SinLess-Games-LLC/Helix-AI',
        documentation: '',
      },
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching version:', error)
    return NextResponse.json(
      { error: 'Failed to fetch version' },
      { status: 500 },
    )
  }
}
