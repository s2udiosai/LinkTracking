'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewLinkPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    slug: '',
    destination: '',
    campaign: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function autoSlug(name: string) {
    return name
      .toUpperCase()
      .replace(/\s+/g, '-')
      .replace(/[^A-Z0-9-]/g, '')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === autoSlug(prev.name) ? autoSlug(name) : prev.slug,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to links
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">New Link</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleNameChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. April Email Campaign"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 whitespace-nowrap">
              /go/
            </span>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
              placeholder="EMAILCAMP042026"
              required
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Use letters, numbers, and hyphens only. Auto-filled from name.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination URL <span className="text-red-500">*</span>
          </label>
          <input
            name="destination"
            type="url"
            value={form.destination}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/your-page"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign / Source
          </label>
          <input
            name="campaign"
            value={form.campaign}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Email Marketing, Facebook Ad, Landing Page"
          />
          <p className="text-xs text-gray-400 mt-1">Where this link will be used. Shown in your click data.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating…' : 'Create Link'}
          </button>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
