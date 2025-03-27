import { createOrReadVectorStoreIndex } from "@/lib/vector-store";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { MetadataMode } from "llamaindex";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemMessage = {
    role: 'system',
    content: 'You are a helpful AI assistant'
  };

  const latestMessage = messages[messages.length - 1 ];
  const index = await createOrReadVectorStoreIndex();

  const retriever = index.asRetriever();
  retriever.similarityTopK = 1;

  const [matchingNode] = await retriever.retrieve(latestMessage.content);

  console.log('matchingNode', matchingNode);

  if (matchingNode.score > 0.8) {
    const knowledge = matchingNode.node.getContent(MetadataMode.NONE);

    systemMessage.content = `
      You are a helpful AI  assistant. Your knowledge is enriched by this document: 
      ---
      ${knowledge}
      ---
      When possible, explain the reasoning for your responses based on this knowledge.
    `;

    console.log('knowledge', knowledge)
  }


  const response = streamText({
    model: openai('gpt-4o-mini'),
    messages: messages,
    system: systemMessage.content
  });

  return response.toDataStreamResponse();

}