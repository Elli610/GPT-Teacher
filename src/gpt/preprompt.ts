import OpenAI from "openai";
import { PREPROMPT_CONTEXT_MSG, PREPROMPT_GET_LECTURE_CHAPTERS_MSG } from "../constant";
import { requestGpt } from "./requestApi";


export async function prepromptGpt(openai: OpenAI, subject: string, lectureContent: string, focus?: string): Promise<{ history: any[], chapters: string[]}> {

  let history: any[] = []; // history of the conversation
  let chapters: string[] = []; // list of the different chapters of the lecture

  /* ----------------------------- get the chapters from the lecture ----------------------------- */
  let cpt = 0;
  do { // loop to ensure gpt returns the chapters with the right format (max 10 try. then throw an error)
    const tmpHistory = PREPROMPT_GET_LECTURE_CHAPTERS_MSG(subject, lectureContent);
    // request gpt to get the chapters
    const tmpChapters = await requestGpt(openai, tmpHistory);

    // check if the answer is well formatted ({ "parts": ["part1", "part2", "part3"] })
    if (tmpChapters.length === 0) {
      console.log("cannot get chapters from gpt");
      continue;
    }
    const lastMessage = tmpChapters[tmpChapters.length - 1].content;

    try {
      console.log(lastMessage);
      const json = JSON.parse(lastMessage);
      if (json.parts) {
        chapters = json.parts;
        history = tmpChapters; // = tmpHistory + gpt answer
      } else {
        console.log("cannot get chapters from gpt");
      }
    } catch (e) {
      console.log("cannot get chapters from gpt");
    }

    cpt ++;
    if(cpt > 10) {
      console.log("cannot get chapters from gpt"); // to avoid infinite loop
      break;
    }
  } while (chapters.length === 0);


  /* ----------------------------- request GPT to ask the questions ----------------------------- */
  history = await requestGpt(openai, history.concat(PREPROMPT_CONTEXT_MSG(subject, lectureContent, chapters, focus)));
  // console.log("prepromptGpt", histor)
  return { history, chapters };
}