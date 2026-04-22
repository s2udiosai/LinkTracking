export interface GeoData {
  city: string
  region: string
  country: string
}

export async function getGeoData(ip: string): Promise<GeoData> {
  const empty: GeoData = { city: '', region: '', country: '' }

  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return empty
  }

  const token = process.env.IPINFO_TOKEN
  if (!token) return empty

  try {
    const res = await fetch(`https://ipinfo.io/${ip}?token=${token}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return empty
    const data = await res.json()
    return {
      city: data.city ?? '',
      region: data.region ?? '',
      country: data.country ?? '',
    }
  } catch {
    return empty
  }
}
