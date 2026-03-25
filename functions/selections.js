// Cloudflare Workers KV binding for storing tournament selections
// This function handles GET/POST requests to save/load user selections

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  // Log all requests
  console.log(`[Function] ${request.method} /api/selections?email=${email}`);

  if (!email) {
    console.error('[Function] Email parameter missing');
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
      console.log(`[Function] GET: Attempting to retrieve from KV key "${kvKey}"`);
      
      // Check if KV binding exists
      if (!env.WSOP_SELECTIONS) {
        console.error('[Function] ERROR: WSOP_SELECTIONS KV binding not found');
        return new Response(JSON.stringify({ 
          error: 'KV binding not configured',
          debug: { kvKey, hasBinding: false }
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const selections = await env.WSOP_SELECTIONS.get(kvKey);
      console.log(`[Function] GET: Retrieved ${selections ? 'data' : 'null'} from KV`);
      
      return new Response(JSON.stringify({ 
        selections: selections ? JSON.parse(selections) : [],
        debug: { kvKey, found: !!selections }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('[Function] GET error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to retrieve selections',
        debug: { message: error.message }
      }), { 
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
      
      console.log(`[Function] POST: Saving ${Array.isArray(selections) ? selections.length : '?'} selections`);
      
      if (!Array.isArray(selections)) {
        console.error('[Function] POST: Selections not an array');
        return new Response(JSON.stringify({ error: 'Selections must be an array' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Check if KV binding exists
      if (!env.WSOP_SELECTIONS) {
        console.error('[Function] ERROR: WSOP_SELECTIONS KV binding not found');
        return new Response(JSON.stringify({ 
          error: 'KV binding not configured',
          debug: { kvKey, hasBinding: false }
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Store in KV with 1-year expiration
      await env.WSOP_SELECTIONS.put(kvKey, JSON.stringify(selections), {
        expirationTtl: 60 * 60 * 24 * 365 // 1 year
      });

      console.log(`[Function] POST: ✅ Successfully saved to KV`);
      return new Response(JSON.stringify({ 
        success: true,
        debug: { kvKey, count: selections.length }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('[Function] POST error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to save selections',
        debug: { message: error.message }
      }), { 
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
