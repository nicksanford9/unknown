/** Voice note → text via Deepgram pre-recorded API. Body is the raw audio blob. */
export async function POST(req: Request) {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) {
    return Response.json(
      { error: "DEEPGRAM_API_KEY is not set in .env.local" },
      { status: 500 },
    );
  }

  const audio = await req.arrayBuffer();
  if (audio.byteLength < 1000) {
    return Response.json({ error: "Recording too short" }, { status: 400 });
  }

  const res = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": req.headers.get("content-type") ?? "audio/webm",
      },
      body: audio,
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: `Deepgram ${res.status}: ${detail.slice(0, 300)}` },
      { status: 502 },
    );
  }

  const data = await res.json();
  const transcript: string =
    data?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
  return Response.json({ transcript });
}
