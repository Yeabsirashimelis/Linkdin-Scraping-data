import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { query } = await request.json()
  if (!query) return new Response(JSON.stringify({ error: 'Missing query' }), { status: 400 })

  const APIFY_TOKEN = process.env.APIFY_TOKEN
  const actorId = '5QnEH5N71IK2mFLrP'

  const startRes = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ searchTerms: query, maxResults: 20 })
  })

  const startJson = await startRes.json()
  const runId = startJson?.data?.id
  if (!runId) return new Response(JSON.stringify({ error: 'No run ID' }), { status: 500 })

  let datasetId = null
  while (!datasetId) {
    const res = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`)
    const json = await res.json()

    if (json.data.status === 'SUCCEEDED') {
      datasetId = json.data.defaultDatasetId
      break
    }

    if (json.data.status === 'FAILED') return new Response(JSON.stringify({ error: 'Failed run' }), { status: 500 })

    await new Promise(r => setTimeout(r, 3000))
  }

  const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`)
  const items = await datasetRes.json()
  return new Response(JSON.stringify(items), { status: 200 })
}
