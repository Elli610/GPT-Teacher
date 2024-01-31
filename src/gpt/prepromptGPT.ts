

/**
 * preprompt ChatGPT as a teacher in teh specified subject that is being taught. This teacher should then ask question to the user to test their knowledge. If the user's response is incorrect, the teacher should provide the correct answer.
 * 
 * @returns 
 */
export async function prepromptGPT(openai: any, subject: string, lectureContent: string[]): Promise<string> {

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You should use JSON outputs. You are a ${subject} teacher and you are teaching me ${subject}. I am a student and I am learning ${subject}. I need you to ask me questions about this lectures: 
        ${lectureContent.join("\n")}
        \n\nwhen you'll ask something to me, i will try to answer it. If I answer correctly, you can ask me another question. If I answer incorrectly, you should provide the correct answer and then you can ask me another question.
        `,
      },
      // { role: "user", content: "Who won the world series in 2020?" },
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  });

  console.log("question: ", completion.choices[0].message.content);
  return completion.choices[0].message.content
}