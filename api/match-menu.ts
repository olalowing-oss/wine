import type { VercelRequest, VercelResponse } from '@vercel/node'

// This endpoint requires ANTHROPIC_API_KEY environment variable in Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured. Please add ANTHROPIC_API_KEY to Vercel environment variables.'
    })
  }

  try {
    const { menuFile, wineListFile, availableWines } = req.body

    // Build the prompt
    let prompt = `You are a professional sommelier. Analyze the provided restaurant menu and recommend wine pairings.

I will provide:
1. A restaurant menu (image, PDF, or text)
2. ${wineListFile ? 'A wine list from the restaurant' : 'A list of wines from my personal collection'}

Your task:
- Extract all dishes from the menu
- For each dish, recommend the best matching wine(s)
- Explain WHY each wine pairs well with the dish
- Give a confidence score (0-100%) for each pairing

Available wines:
${JSON.stringify(availableWines, null, 2)}

Please respond with a JSON object in this format:
{
  "matches": [
    {
      "dish": "Dish name",
      "description": "Brief description if available",
      "recommendedWines": [
        {
          "id": "wine-id-from-available-list",
          "name": "Wine name",
          "producer": "Producer name",
          "type": "Wine type",
          "reason": "Detailed explanation of why this pairs well",
          "confidence": 95
        }
      ]
    }
  ]
}
`

    // Prepare content for Claude API
    const content: any[] = []

    // Add menu file
    if (menuFile.type.startsWith('image/')) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: menuFile.type,
          data: menuFile.content,
        },
      })
    } else {
      // For PDF or text, we'd need to extract text first
      // For now, just add as text content
      const menuText = Buffer.from(menuFile.content, 'base64').toString('utf-8')
      content.push({
        type: 'text',
        text: `Restaurant Menu:\n${menuText}`,
      })
    }

    // Add wine list if provided
    if (wineListFile) {
      if (wineListFile.type.startsWith('image/')) {
        content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: wineListFile.type,
            data: wineListFile.content,
          },
        })
        content.push({
          type: 'text',
          text: 'This is the restaurant\'s wine list.',
        })
      } else {
        const wineListText = Buffer.from(wineListFile.content, 'base64').toString('utf-8')
        content.push({
          type: 'text',
          text: `Restaurant Wine List:\n${wineListText}`,
        })
      }
    }

    // Add final prompt
    content.push({
      type: 'text',
      text: prompt,
    })

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Claude API error:', error)
      return res.status(response.status).json({
        error: 'AI analysis failed',
        details: error,
      })
    }

    const data = await response.json()
    const aiResponse = data.content[0].text

    // Try to parse JSON from response
    let matches
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
                       aiResponse.match(/```\s*([\s\S]*?)\s*```/)

      if (jsonMatch) {
        matches = JSON.parse(jsonMatch[1])
      } else {
        matches = JSON.parse(aiResponse)
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      return res.status(500).json({
        error: 'Failed to parse AI response',
        rawResponse: aiResponse,
      })
    }

    return res.status(200).json(matches)
  } catch (error) {
    console.error('Error in match-menu API:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
