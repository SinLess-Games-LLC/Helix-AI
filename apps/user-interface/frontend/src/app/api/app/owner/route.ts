import { NextResponse } from 'next/server'

export async function GET() {
  const owners = [
    { name: 'SinLess-Games-LLC', id: 1 },
    { name: 'Timothy A. Pierce', id: 2 },
  ]

  return NextResponse.json(owners)
}
