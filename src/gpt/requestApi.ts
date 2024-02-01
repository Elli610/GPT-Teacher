import OpenAI from "openai";

/**
 * Send the answer to the question asked by GPT to the API
 * 
 * @param openai OpenAI object
 * @param history History of the conversation
 * 
 * @returns The history with the new answer
 */
export async function requestGpt(openai: OpenAI, history: any[]): Promise<any[]> {
  if(history.length === 0) {
    console.log("cannot request gpt without history");
    return [];
  }
  const completion = await openai.chat.completions.create({
    messages: history,
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  });
  return [...history, { role: "assistant", content: completion.choices[0].message.content },];
}
