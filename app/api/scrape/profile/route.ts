import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing profile url' }), { status: 400 })
    }

    const APIFY_TOKEN = process.env.APIFY_TOKEN
    if (!APIFY_TOKEN) {
      return new Response(JSON.stringify({ error: 'Missing APIFY_TOKEN in environment' }), { status: 500 })
    }

    const actorId = 'yZnhB5JewWf9xSmoM'
    const startUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`

    console.log('Starting actor run with URL:', startUrl)
    console.log('Profile URL to scrape:', url)

    // Start the actor run
    const startRes = await fetch(startUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: [{ url }] })
    })

    const startJson = await startRes.json()
    console.log('Start response:', startJson)

    const runId = startJson?.data?.id
    if (!runId) {
      return new Response(JSON.stringify({ error: 'No run ID returned', startJson }), { status: 500 })
    }

    // Poll for run completion
    let datasetId: string | null = null
    while (!datasetId) {
      const res = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`)
      const json = await res.json()
      console.log('Run status:', json?.data?.status)

      if (json.data.status === 'SUCCEEDED') {
        datasetId = json.data.defaultDatasetId
        break
      }

      if (json.data.status === 'FAILED') {
        return new Response(JSON.stringify({ error: 'Actor run failed' }), { status: 500 })
      }

      // Wait 3 seconds before next poll
      await new Promise((r) => setTimeout(r, 3000))
    }

    // Fetch dataset items
    const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`)
    const items = await datasetRes.json()
    console.log('Scraped items:', items)

    return new Response(JSON.stringify(items), { status: 200 })
  } catch (error) {
    console.error('Error in scraper API:', error)
    return new Response(JSON.stringify({ message: String(error) }), { status: 500 })
  }
}
