import type { VercelRequest, VercelResponse } from '@vercel/node'

// This endpoint requires OPENAI_API_KEY environment variable in Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured. Please add OPENAI_API_KEY or VITE_OPENAI_API_KEY to Vercel environment variables.'
    })
  }

  try {
    const { menuFile, wineListFile, availableWines } = req.body

    // Build the prompt
    const systemPrompt = `You are a professional sommelier. Analyze the provided restaurant menu and recommend wine pairings.

Your task:
- Extract all dishes from the menu
- For each dish, recommend the best matching wine(s) from the available list
- Explain WHY each wine pairs well with the dish
- Give a confidence score (0-100%) for each pairing

Available wines:
${JSON.stringify(availableWines, null, 2)}

IMPORTANT: You MUST respond with ONLY a valid JSON object. No markdown, no explanations, no code blocks. Just pure JSON.

Response format:
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
}`

    // Prepare content for OpenAI API
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ]

    const userContent: any[] = []

    // Add menu file
    if (menuFile.type.startsWith('image/')) {
      userContent.push({
        type: 'text',
        text: 'Here is the restaurant menu:',
      })
      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:${menuFile.type};base64,${menuFile.content}`,
        },
      })
    } else {
      // For PDF or text, extract text
      const menuText = Buffer.from(menuFile.content, 'base64').toString('utf-8')
      userContent.push({
        type: 'text',
        text: `Restaurant Menu:\n${menuText}`,
      })
    }

    // Add wine list if provided
    if (wineListFile) {
      if (wineListFile.type.startsWith('image/')) {
        userContent.push({
          type: 'text',
          text: '\n\nHere is the restaurant\'s wine list:',
        })
        userContent.push({
          type: 'image_url',
          image_url: {
            url: `data:${wineListFile.type};base64,${wineListFile.content}`,
          },
        })
      } else {
        const wineListText = Buffer.from(wineListFile.content, 'base64').toString('utf-8')
        userContent.push({
          type: 'text',
          text: `\n\nRestaurant Wine List:\n${wineListText}`,
        })
      }
    }

    userContent.push({
      type: 'text',
      text: '\n\nPlease analyze the menu and provide wine pairing recommendations in the JSON format specified.',
    })

    messages.push({
      role: 'user',
      content: userContent,
    })

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // GPT-4 Turbo with vision
        messages,
        max_tokens: 4096,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      return res.status(response.status).json({
        error: 'AI analysis failed',
        details: error,
      })
    }

    const data = await response.json() as any
    const aiResponse = data.choices[0].message.content

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
