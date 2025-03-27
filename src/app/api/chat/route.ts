import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log('messages', messages);

  const response = streamText({
    model: openai('gpt-4o-mini'),
    messages: messages
  });

  return response.toDataStreamResponse();

}