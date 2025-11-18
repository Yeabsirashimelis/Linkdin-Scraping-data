'use client'
import { useState } from 'react'

export default function ScraperPage({ title, fields, endpoint }: {
  title: string,
  fields: { name: string, label: string, placeholder: string }[],
  endpoint: string
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  function updateField(name: string, value: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setForm((prev: any) => ({ ...prev, [name]: value }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setResult(json)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ marginBottom: 12 }}>{title}</h2>

      <form onSubmit={submit} style={{ padding: 20, border: '1px solid #ddd', borderRadius: 12, background: 'white' }}>
        {fields.map(field => (
          <label key={field.name} style={{ display: 'block', marginBottom: 16 }}>
            {field.label}<br />
            <input
              type="text"
              placeholder={field.placeholder}
              onChange={e => updateField(field.name, e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 6 }}
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 18px', borderRadius: 8, background: '#0070f3', color: 'white', border: 'none' }}
        >
          {loading ? 'Scraping...' : 'Run Scraper'}
        </button>
      </form>

      {error && <pre style={{ marginTop: 20, color: 'red' }}>{error}</pre>}

      {result && (
        <div style={{ marginTop: 24, padding: 20, background: '#fafafa', borderRadius: 12 }}>
          <h3>Results</h3>
          <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 400, overflow: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}