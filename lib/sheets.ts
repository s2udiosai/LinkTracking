import { google } from 'googleapis'

export interface LinkRecord {
  name: string
  slug: string
  destination: string
  campaign: string
  createdAt: string
}

export interface ClickRecord {
  timestamp: string
  slug: string
  name: string
  campaign: string
  destination: string
  city: string
  region: string
  country: string
  ip: string
  userAgent: string
}

function getSheetsClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var is missing')

  const credentials = JSON.parse(raw)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
}

function spreadsheetId() {
  const id = process.env.SPREADSHEET_ID
  if (!id) throw new Error('SPREADSHEET_ID env var is missing')
  return id
}

export async function getLinks(): Promise<LinkRecord[]> {
  const sheets = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId(),
    range: 'Links!A2:E',
  })
  const rows = res.data.values ?? []
  return rows.map((row) => ({
    name: row[0] ?? '',
    slug: row[1] ?? '',
    destination: row[2] ?? '',
    campaign: row[3] ?? '',
    createdAt: row[4] ?? '',
  }))
}

export async function getLinkBySlug(slug: string): Promise<LinkRecord | null> {
  const links = await getLinks()
  return links.find((l) => l.slug === slug) ?? null
}

export async function createLink(link: Omit<LinkRecord, 'createdAt'>): Promise<void> {
  const sheets = getSheetsClient()
  const createdAt = new Date().toISOString()
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: 'Links!A:E',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[link.name, link.slug, link.destination, link.campaign, createdAt]],
    },
  })
}

export async function deleteLink(slug: string): Promise<void> {
  const sheets = getSheetsClient()
  const id = spreadsheetId()

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: 'Links!A:E',
  })
  const rows = res.data.values ?? []
  const rowIndex = rows.findIndex((row, i) => i > 0 && row[1] === slug)
  if (rowIndex === -1) return

  const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId: id })
  const linksSheet = sheetMeta.data.sheets?.find(
    (s) => s.properties?.title === 'Links'
  )
  const sheetId = linksSheet?.properties?.sheetId ?? 0

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: id,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  })
}

export async function logClick(click: ClickRecord): Promise<void> {
  const sheets = getSheetsClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: 'Clicks!A:J',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        click.timestamp,
        click.slug,
        click.name,
        click.campaign,
        click.destination,
        click.city,
        click.region,
        click.country,
        click.ip,
        click.userAgent,
      ]],
    },
  })
}
