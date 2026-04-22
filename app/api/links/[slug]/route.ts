import { NextRequest, NextResponse } from 'next/server'
import { deleteLink } from '@/lib/sheets'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await deleteLink(params.slug)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
  }
}
