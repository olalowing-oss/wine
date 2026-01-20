// Enkel lokal API-server för att köra Vercel serverless functions lokalt
require('dotenv').config(); // Ladda .env-filen
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

// Logga att miljövariabler är laddade
console.log('Environment variables loaded:');
console.log('VITE_OPENAI_API_KEY:', process.env.VITE_OPENAI_API_KEY ? 'Present ✓' : 'Missing ✗');

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle /api/match-menu endpoint
  if (req.url === '/api/match-menu' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);

        // Import and run the actual API function
        const matchMenuFunction = require('./api/match-menu.js');

        // Create mock request/response objects for Vercel function
        const mockReq = {
          body: data,
          method: 'POST'
        };

        const mockRes = {
          status: (code) => ({
            json: (data) => {
              res.writeHead(code, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
            }
          }),
          json: (data) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          }
        };

        // Call the function
        await matchMenuFunction.default(mockReq, mockRes);
      } catch (error) {
        console.error('API Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`   API endpoint: http://localhost:${PORT}/api/match-menu`);
});
