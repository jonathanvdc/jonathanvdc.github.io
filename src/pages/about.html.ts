export function GET() {
  return new Response(
    '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/"><title>Redirecting</title><p>Redirecting to <a href="/">the homepage</a>.</p>',
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    }
  );
}
