/**
 * HTTP response helpers for Netlify Functions.
 * Keeps response format consistent across all functions.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...CORS },
    body: JSON.stringify(body),
  };
}

function ok(data) {
  return json(200, { ok: true, ...data });
}

function badRequest(message, details) {
  return json(400, { ok: false, error: message, ...(details && { details }) });
}

function serverError(message) {
  return json(500, { ok: false, error: message });
}

function options() {
  return { statusCode: 204, headers: CORS, body: '' };
}

module.exports = { ok, badRequest, serverError, options };
