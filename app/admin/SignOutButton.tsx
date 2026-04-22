'use client'

export default function SignOutButton() {
  async function handleSignOut() {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-gray-500 hover:text-gray-700"
    >
      Sign out
    </button>
  )
}
