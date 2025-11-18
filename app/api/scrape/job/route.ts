import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  console.log("*************************************")
  try {
  const { url } = await request.json()
  if (!url) return new Response(JSON.stringify({ error: 'Missing job url' }), { status: 400 })

  const APIFY_TOKEN = process.env.APIFY_TOKEN
  const actorId = 'BHzefUZlZRKWxkTck'

  const startRes = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startUrls: [{ url }], maxItems: 1 })
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

  console.log("**********************************************")
  console.log(items)
  console.log("**********************************************")

  return new Response(JSON.stringify(items), { status: 200 })
   } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({message: error}), {status: 500})
  }
}