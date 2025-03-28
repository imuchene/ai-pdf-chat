import { encodingForModel } from "js-tiktoken";
import { Message } from "ai";

const encoding = encodingForModel('gpt-4o-mini');
const TOKEN_LIMIT = 4097 * 0.9 // we want to be safe
export const MAX_RESPONSE_TOKENS = 600;

function countTokens(text: string) {
  const tokens = encoding.encode(text);
  return tokens.length;
}

export function trimMessages(messages: Message[]): Message[] {
  const [systemMessage, ...restOfTheMessages] = messages;
  let totalTokens = countTokens(systemMessage.content) + MAX_RESPONSE_TOKENS;
  const trimmedMessages = [];

  // Keep as many messages as I can, up until I reach the token limit
  for (const message of restOfTheMessages.reverse()) {
    const newTotalTokens = totalTokens + countTokens(message.content);

    if (newTotalTokens > TOKEN_LIMIT) {
      break;
    }
    else {
      trimmedMessages.unshift(message);
      totalTokens = newTotalTokens;
    }
  }

  console.log(`Total tokens: ${totalTokens}`);
  trimmedMessages.unshift(systemMessage);
  return trimmedMessages;
}