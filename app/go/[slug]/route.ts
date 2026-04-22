import { NextRequest, NextResponse } from 'next/server'
import { getLinkBySlug, logClick } from '@/lib/sheets'
import { getGeoData } from '@/lib/geo'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  const link = await getLinkBySlug(slug)
  if (!link) {
    return new NextResponse('Link not found', { status: 404 })
  }

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : ''

  const geo = await getGeoData(ip)

  logClick({
    timestamp: new Date().toISOString(),
    slug: link.slug,
    name: link.name,
    campaign: link.campaign,
    destination: link.destination,
    city: geo.city,
    region: geo.region,
    country: geo.country,
    ip,
    userAgent: request.headers.get('user-agent') ?? '',
  }).catch(() => {})

  return NextResponse.redirect(link.destination, { status: 302 })
}
