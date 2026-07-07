exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return { statusCode: 400, body: 'Invalid JSON' };
    }

    const { token, path } = body;
    if (!token || !path) {
        return { statusCode: 400, body: 'Missing token or path' };
    }

    // Restrict to Smartsheet API paths only (allow query strings)
    if (!/^\/[a-zA-Z0-9\/_\-?=,&.]+$/.test(path)) {
        return { statusCode: 400, body: 'Invalid path' };
    }

    const url = `https://api.smartsheet.com/2.0${path}`;
    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.text();
    return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: data,
    };
};
