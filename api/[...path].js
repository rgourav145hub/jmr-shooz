import { handleRequest } from '../server/index.js';

export default async function handler(req, res) {
  try {
    return await handleRequest(req, res);
  } catch (err) {
    console.error('API Error in Vercel catch-all handler:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Serverless execution error', details: err.message }));
  }
}
