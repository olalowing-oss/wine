// This endpoint requires OPENAI_API_KEY environment variable in Vercel
export default async function handler(req, res) {
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
    const systemPrompt = `Du är en professionell sommelier med djup kunskap om mat och vin. Analysera den bifogade restaurangmenyn och rekommendera vinmatchningar.

Din uppgift:
- Extrahera alla rätter från menyn
- För varje rätt, rekommendera de bäst matchande vinerna från den tillgängliga vinlistan
- Ge en UTFÖRLIG förklaring (minst 2-3 meningar) om VARFÖR varje vin passar bra till rätten
- Diskutera smaker, syra, textur, och hur vinet kompletterar eller kontrasterar rättens ingredienser
- Nämn specifika element i både rätten och vinet som gör att de harmoniserar
- Ge ett konfidenspoäng (0-100%) för varje matchning

Tillgängliga viner:
${JSON.stringify(availableWines, null, 2)}

VIKTIGT: Du MÅSTE svara med ENDAST ett giltigt JSON-objekt. Ingen markdown, inga förklaringar, inga kodblock. Bara ren JSON.

Svarsformat:
{
  "matches": [
    {
      "dish": "Rättens namn",
      "description": "Kort beskrivning om tillgänglig",
      "recommendedWines": [
        {
          "id": "vin-id-från-tillgänglig-lista",
          "name": "Vinets namn",
          "producer": "Producent",
          "type": "Vintyp",
          "reason": "Mycket utförlig förklaring (minst 2-3 meningar) om varför detta vin passar perfekt till rätten. Diskutera smaker, syra, textur och specifika element som harmoniserar.",
          "confidence": 95
        }
      ]
    }
  ]
}`

    // Prepare content for OpenAI API
    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ]

    const userContent = []

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
      text: '\n\nVänligen analysera menyn och ge vinmatchningsrekommendationer i det specificerade JSON-formatet. Kom ihåg att vara MYCKET utförlig i dina förklaringar - minst 2-3 meningar per vinmatchning.',
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

    const data = await response.json()
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
