// Cloudflare Workers KV binding for storing tournament selections
// This function handles GET/POST requests to save/load user selections

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email parameter required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Use email as the key
  const kvKey = `wsop_selections_${email}`;

  if (request.method === 'GET') {
    // Retrieve selections
    try {
      const selections = await env.WSOP_SELECTIONS.get(kvKey);
      return new Response(JSON.stringify({ 
        selections: selections ? JSON.parse(selections) : [] 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to retrieve selections' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (request.method === 'POST') {
    // Save selections
    try {
      const body = await request.json();
      const { selections } = body;
      
      if (!Array.isArray(selections)) {
        return new Response(JSON.stringify({ error: 'Selections must be an array' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Store in KV with 1-year expiration
      await env.WSOP_SELECTIONS.put(kvKey, JSON.stringify(selections), {
        expirationTtl: 60 * 60 * 24 * 365 // 1 year
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to save selections' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
