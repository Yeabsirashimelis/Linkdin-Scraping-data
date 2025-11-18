'use client'

import { useState } from 'react'

type ScrapeType = 'job' | 'profile' | 'company'

export default function ScrapeForm() {
  const [type, setType] = useState<ScrapeType>('job')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, url })
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Server error')
      }

      const json = await res.json()
      setResult(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 820 }}>
      <label style={{ display: 'block', marginBottom: 8 }}>
        Scraper Type
        <select value={type} onChange={e => setType(e.target.value as ScrapeType)} style={{ display: 'block', marginTop: 6 }}>
          <option value="job">Job</option>
          <option value="profile">Profile</option>
          <option value="company">Company</option>
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: 12 }}>
        URL to scrape
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.linkedin.com/jobs/view/..."
          style={{ display: 'block', width: '100%', marginTop: 6, padding: 8 }}
        />
      </label>

      <button type="submit" disabled={loading || url.trim() === ''} style={{ padding: '8px 14px' }}>
        {loading ? 'Running...' : 'Run Scraper'}
      </button>

      {error && <pre style={{ color: 'crimson', marginTop: 12 }}>{error}</pre>}

      {result && (
        <div style={{ marginTop: 16 }}>
          <h3>Result</h3>
          <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f7f7f7', padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  )
}