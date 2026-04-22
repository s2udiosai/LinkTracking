import Link from 'next/link'
import { getLinks, type LinkRecord } from '@/lib/sheets'
import DeleteButton from './DeleteButton'
import CopyButton from './CopyButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  let links: LinkRecord[] = []
  let error = ''

  try {
    links = await getLinks()
  } catch (e) {
    error = 'Could not load links. Check your Google Sheets configuration.'
    console.error(e)
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Links</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {links.length} link{links.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/new"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + New Link
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {links.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No links yet.</p>
          <p className="text-sm mt-1">
            <Link href="/admin/new" className="text-blue-600 hover:underline">
              Create your first link
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tracking URL</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Destination</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Campaign / Source</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {links.map((link) => {
                const trackingUrl = `${baseUrl}/go/${link.slug}`
                return (
                  <tr key={link.slug} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{link.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-blue-700 break-all">
                          {trackingUrl}
                        </code>
                        <CopyButton text={trackingUrl} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                      <a
                        href={link.destination}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                      >
                        {link.destination}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{link.campaign || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <DeleteButton slug={link.slug} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
