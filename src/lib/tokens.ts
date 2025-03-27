import { encoding_for_model } from "@dqbd/tiktoken";

const encoding = encoding_for_model('gpt-4o-mini')

function countTokens(text: string){
  const tokens = encoding.encode(text);
  return tokens.length;
}