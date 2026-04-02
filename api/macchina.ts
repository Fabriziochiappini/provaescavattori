export default async function handler(req: any, res: any) {
  const { id } = req.query;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  
  // Base URL for the site
  const baseUrl = `${protocol}://${host}`;
  const indexUrl = `${baseUrl}/index.html`;

  try {
    // 1. Fetch the default index.html
    const response = await fetch(indexUrl);
    let html = await response.text();

    if (id) {
      // 2. Fetch machine data from Firestore REST API
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/contegroup-7f176/databases/(default)/documents/excavators/${id}`;
      const dbRes = await fetch(firestoreUrl);
      
      if (dbRes.ok) {
        const data = await dbRes.json();
        
        if (data.fields) {
          const name = data.fields.name?.stringValue || '';
          const brand = data.fields.brand?.stringValue || '';
          const description = data.fields.description?.stringValue || 'Visita il nostro sito per scoprire tutti i dettagli su questo mezzo.';
          
          let imageUrl = '';
          if (
            data.fields.images && 
            data.fields.images.arrayValue && 
            data.fields.images.arrayValue.values && 
            data.fields.images.arrayValue.values.length > 0
          ) {
            imageUrl = data.fields.images.arrayValue.values[0].stringValue;
          } else if (data.fields.imageUrl?.stringValue) {
            imageUrl = data.fields.imageUrl.stringValue;
          }

          if (imageUrl === '') {
             imageUrl = `${baseUrl}/images/icon-512.png`;
          }

          const title = `Conte Group - ${brand} ${name}`.trim();
          const desc = description.substring(0, 150).replace(/\n/g, ' ') + (description.length > 150 ? '...' : '');

          const metaTags = `
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${baseUrl}/macchina/${id}" />
  <meta property="og:type" content="website" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${imageUrl}" />`;

          // Replace default tags with the specific ones
          
          // Remove default og/twitter tags if they exist (we added them to index.html)
          html = html.replace(/<meta property="og:[^>]+>/g, '');
          html = html.replace(/<meta name="twitter:[^>]+>/g, '');
          html = html.replace(/<title>.*?<\/title>/g, '');

          // Inject specific tags
          html = html.replace('</head>', `${metaTags}\n</head>`);
        }
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching Open Graph data:', error);
    // In case of error, redirect to index.html or just return it unmodified if possible
    res.redirect(302, '/');
  }
}
