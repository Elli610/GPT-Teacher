import { randomSelection } from "./randomSelection";


// used to preprompt gpt: get the lecture parts as a json object.
/*
- Since the model is always stuck in the same part of the lecture, we need to redirect it to another part of the lecture.
  This variable is used in src/gpt/preprompt.ts to extract the different parts of the lecture as a list. Each time the user click on 'Ask another question", 
  the script will randomly chose a part of the lecture and redirect the model to this part.
- Didn't find any preprompt online so I had to create my own. I tried to make it as simple as possible.
*/
export const PREPROMPT_GET_LECTURE_CHAPTERS_MSG = (subject: string, lectureContent: string, focus?: string) => [{
  role: "system",
  content: `You should use JSON outputs to format your messages.`,
}, {
  role: "system",
  content: `You are a ${subject} teacher and you are teaching me ${subject}. I am your student and I am learning ${subject}. I need you to ask me questions about this lectures: 
${lectureContent}

Give me the different parts of the lecture as a json object: { "parts": ["part1", "part2", "part3"] }.`
}];

// used to preprompt gpt: give it the context of the conversation and what is expected
/*
Gives some context to the model and tell it what is expected from it. This is the best way I found to make the model understand what is expected from it and keep
it from going off topic or asking questions about the same part of the lecture again and again.
*/
export const PREPROMPT_CONTEXT_MSG = (subject: string, lectureContent: string, chapters: string[], focus?: string) => [{
  role: "system",
  content: `You are a ${subject} teacher and you are teaching me ${subject}. I am a student and I am learning ${subject}. You are interrogating me about this lectures: 
${lectureContent}
${focus ?? `\nPlease focus your questions on ${focus}.`}

When you'll ask something to me, I will try to answer it. If I answer correctly, you can congrats me. if I my answer is incorrect, you have to provide me the correct answer in a detailed information. Then, wait for me to request another question.
${chapters.length > 0? `The first question should be about ${randomSelection(chapters)}.` : ""}` // allow the model to ask question about the different parts of the lecture
}];

// message used to request gpt for another question
/*
- Sometimes, the model will only ask question about 1 sub part of the lecture. To avoid this, we need to redirect it to another part of the lecture.
- I tried more sophisticated methods to redirect the model to another part of the lecture, but it didn't work as well as this simple method.
*/
export const NEXT_QUESTION_MSG = (chapters: string[]) => `Please ask me a question about ${randomSelection(chapters)}.`;


