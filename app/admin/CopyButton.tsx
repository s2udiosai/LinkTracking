'use client'

export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-1.5 py-0.5 hover:border-gray-300 transition-colors"
      title="Copy URL"
    >
      Copy
    </button>
  )
}
