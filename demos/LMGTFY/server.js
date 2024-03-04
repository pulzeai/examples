require('dotenv').config();
const OpenAI = require('openai').default;
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.dev.pulze.ai/v1",
    defaultHeaders: {
      "Pulze-Labels": JSON.stringify({ "foo": "bar" }),
      "Pulze-Weights": JSON.stringify({ "cost": 0.2, "quality": 0.8, "latency": 0 }),
    },
  });

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // Parse the URL

// Serve index.html for the root path
if (parsedUrl.pathname === '/' && req.method === 'GET') {
    const indexPath = path.join(__dirname, 'public/index.html'); // Adjust the path to your index.html

    fs.readFile(indexPath, (err, data) => {
        if (err) {
        console.error('Error reading index.html:', err);
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
} else if (parsedUrl.pathname === '/autocomplete' && req.method === 'GET') {
    const query = parsedUrl.query.query; // Extract the query parameter

    if (!query) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Query parameter is required' }));
      return; // Ensure no further processing is done after sending the response
    }

    // Simulate fetching autocomplete suggestions (replace with your actual logic)
    const suggestions = ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(suggestions));
} else if (parsedUrl.pathname === '/search' && req.method === 'GET') {
    // Since this is a new scope inside the 'if' statement, you can declare an async function here and immediately invoke it
    (async () => {
        const query = parsedUrl.query.query;
        if (!query) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Query parameter is required' }));
            return;
        }

        try {
            // Define the configuration for the OpenAI completion request
            const config = {
                model: 'Pulze',
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: query,
                    },
                ],
            };

            // Call the OpenAI API for a response and wait for the promise to resolve
            const completion = await openai.chat.completions.create(config);
            if (completion && completion.choices && completion.choices.length > 0) {
                const choice = completion.choices[0];
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    content: choice.message.content,
                    model: completion.model,
                    meta: completion
                }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ content: 'No response from AI.' }));
            }
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    })();
} else {
    // Respond with 404 for any other endpoint
    res.writeHead(404);
    res.end('Not Found');
}

});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
