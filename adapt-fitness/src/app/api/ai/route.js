import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, system, stream = false, json = false } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'messages array required' }, { status: 400 });
    }

    // ── STREAMING MODE (AI Coach) ─────────────────────────────────────────────
    if (stream) {
      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          try {
            const response = await client.messages.stream({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 1000,
              system: system || '',
              messages,
            });

            for await (const event of response) {
              if (
                event.type === 'content_block_delta' &&
                event.delta?.type === 'text_delta'
              ) {
                const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`;
                controller.enqueue(encoder.encode(chunk));
              }
            }

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (err) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`)
            );
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // ── STANDARD MODE (Workout generator, Food analyser, Check-in) ───────────
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: system || '',
      messages,
    });

    const text = response.content?.map((b) => b.text || '').join('') || '';

    // JSON mode: parse and return structured data
    if (json) {
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
        return Response.json({ data: parsed });
      } catch {
        return Response.json({ error: 'Failed to parse JSON response', raw: text }, { status: 422 });
      }
    }

    return Response.json({ text });
  } catch (err) {
    console.error('AI route error:', err);
    return Response.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
