import { NextRequest, NextResponse } from 'next/server'
import { getLinks, createLink } from '@/lib/sheets'

export async function GET() {
  try {
    const links = await getLinks()
    return NextResponse.json(links)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, destination, campaign } = body

    if (!name || !slug || !destination) {
      return NextResponse.json({ error: 'name, slug, and destination are required' }, { status: 400 })
    }

    const slugClean = slug.trim().replace(/\s+/g, '-')

    const existing = await getLinks()
    if (existing.some((l) => l.slug === slugClean)) {
      return NextResponse.json({ error: 'A link with this slug already exists' }, { status: 409 })
    }

    await createLink({ name, slug: slugClean, destination, campaign: campaign ?? '' })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}
