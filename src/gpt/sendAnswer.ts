

/**
 * Send the answer to the question asked by GPT to the API
 * 
 * @param openai 
 * @param question 
 * @param lectureContent 
 * @returns 
 */
export async function sendAnswer(openai: any, question: string, lectureContent: string[], answer: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You should use JSON outputs. You are a student and you are learning ${lectureContent.join("\n")}. I am a teacher and I am teaching you ${lectureContent.join("\n")}. I need you to answer this question: ${question}`,
      },
      { role: "user", content: "My answer is: " + answer },
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  });
  return completion.choices[0].message.content;
}