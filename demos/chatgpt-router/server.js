require('dotenv').config();
const OpenAI = require('openai').default;
const http = require('http');
const fs = require('fs');
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

// Create an HTTP server
const server = http.createServer();

server.on('request', async (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    // Serve the index.html file
    const indexPath = path.join(__dirname, 'public/index.html'); // Adjust the path according to your file structure
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
  } else if (req.url.startsWith('/send') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', async () => {
        try {
            const requestData = JSON.parse(body);
            const message = requestData.message;
            const streamEnabled = requestData.stream;

            if (!streamEnabled) {
                // Define the configuration for the OpenAI completion request
                const config = {
                    model: 'Pulze',
                    messages: [
                        {
                            content: message,
                            role: 'user',
                        },
                    ],
                };

                // Call the OpenAI API for a response
                const completion = await openai.chat.completions.create(config);
                const [choice] = completion.choices;
                if (choice && choice.message && choice.message.content) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        content: choice.message.content,
                        meta: completion,
                     }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ content: 'No response from AI.' }));
                }
            } else {
                // Store the message for streaming
                global.latestMessage = message;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Message received for streaming' }));
            }
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    });
} else if (req.url.startsWith('/stream') && req.method === 'GET') {
    // Define the configuration for the completion request using the latest message
    const config = {
      model: 'pulze',
      stream: true,
      messages: [
        {
          content: global.latestMessage,
          role: 'user',
        },
      ],
    };

    try {
      const completion = await openai.chat.completions.create(config);

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      for await (const chunk of completion) {
        const [choice] = chunk.choices;
        if (choice && choice.delta && choice.delta.content) {
          // Construct a JSON object that includes both data and meta information
          const messageObject = {
            content: choice.delta.content, // The actual response content
            meta: {
              model: chunk.model,
              length: choice.delta.content.length, // Example meta information
              timestamp: new Date().toISOString(), // Another example meta information
              // Add more meta data as needed
            }
          };

          // Convert the JSON object to a string and send it as part of the response
          res.write(`data: ${JSON.stringify(messageObject)}\n\n`);
        }
        console.log(chunk);
      }

      res.end();
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// Listen on port 3000
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
