import { NextRequest } from 'next/server'

// Server-side route handler for Next.js App Router
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, url } = body as { type: string; url: string }

    if (!type || !url) {
      return new Response(JSON.stringify({ error: 'Missing type or url' }), { status: 400 })
    }

    // Map type to Apify actor
    const actorMap: Record<string, string> = {
      job: 'apify/linkedin-jobs-scraper',
      profile: 'apify/linkedin-profile-scraper',
      company: 'apify/linkedin-company-scraper'
    }

    const actorId = actorMap[type]
    if (!actorId) return new Response(JSON.stringify({ error: 'Unsupported type' }), { status: 400 })

    const APIFY_TOKEN = process.env.APIFY_TOKEN
    if (!APIFY_TOKEN) return new Response(JSON.stringify({ error: 'Missing APIFY_TOKEN on server' }), { status: 500 })

    // Start the actor
    const startRes = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startUrls: [{ url }], maxItems: 5 })
    })

    if (!startRes.ok) {
      const text = await startRes.text()
      return new Response(JSON.stringify({ error: 'Failed to start actor', detail: text }), { status: 502 })
    }

    const runData = await startRes.json()
    const runId = runData?.data?.id
    if (!runId) return new Response(JSON.stringify({ error: 'No run id returned' }), { status: 500 })

    // Poll actor run status until SUCCEEDED or FAILED
    const statusUrl = `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    let datasetId: string | null = null
    let attempts = 0

    while (!datasetId && attempts < 60) { // ~3 minutes max (60 * ~3s)
      const statusRes = await fetch(statusUrl)
      if (!statusRes.ok) {
        // try again
        await new Promise(r => setTimeout(r, 2000))
        attempts++
        continue
      }
      const statusJson = await statusRes.json()
      const status = statusJson?.data?.status

      if (status === 'SUCCEEDED') {
        datasetId = statusJson.data.defaultDatasetId
        break
      }

      if (status === 'FAILED') {
        return new Response(JSON.stringify({ error: 'Actor run failed', detail: statusJson }), { status: 502 })
      }

      // wait a little
      await new Promise(r => setTimeout(r, 3000))
      attempts++
    }

    if (!datasetId) {
      return new Response(JSON.stringify({ error: 'Actor run did not finish in time' }), { status: 504 })
    }

    // fetch dataset items
    const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`)
    if (!datasetRes.ok) {
      const text = await datasetRes.text()
      return new Response(JSON.stringify({ error: 'Failed to fetch dataset', detail: text }), { status: 502 })
    }

    const items = await datasetRes.json()

    return new Response(JSON.stringify({ runId, items }), { status: 200 })
  } catch (err: any) {
    console.log(err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
