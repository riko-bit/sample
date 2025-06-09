import { NextResponse } from 'next/server';

const GEMINI_API_KEY = "AIzaSyAwTfhcPrUosS97lYNs2TE-8mmYDcMlhxU";

export async function POST(req: Request) {
  try {
    const input = await req.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: input.prompt
                }
              ]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Gemini API error: " + errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error contacting Gemini API: " + error.message }, { status: 500 });
  }
}
