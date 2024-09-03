import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    name: 'Helix AI API',
    description: 'Frontend API for Helix AI',
    version: '1.0.0',
  }

  return NextResponse.json(data)
}
