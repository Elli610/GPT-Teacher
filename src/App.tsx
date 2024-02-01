import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

import OpenAIApi from 'openai';
import { requestGpt } from './gpt/requestApi';
import { formatAnswer, formatQuestion } from './format';
import { prepromptGpt } from './gpt/preprompt';
import { NEXT_QUESTION_MSG } from './constant';

const YOUR_API_KEY = "";

const openai = new OpenAIApi({ apiKey: YOUR_API_KEY, dangerouslyAllowBrowser: true });

// main();
function App() {

  const [subject, setSubject] = useState(""); // subject of the lecture
  const [lectureContent, setLecture] = useState<string>(""); // lecture content
  const [isReady, setIsReady] = useState(false);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false); // if true, then the gpt is asking a question
  const [preprompting, setPreprompting] = useState(false); // if true, then the gpt is preprompting
  const [isQuestionLoading, setIsQuestionLoading] = useState(false); // if true, then the gpt is loading a question
  const [isAnswerLoading, setIsAnswerLoading] = useState(false); // if true, then the gpt is loading an answer

  const [history, setHistory] = useState<any[]>([]); // history of all messages from/to the api
  const [apiQuestion, setApiQuestion] = useState(""); // question to answer to the api
  const [apiResponse, setApiResponse] = useState(""); // api reaction to the student response
  const [lastStudentResponse, setLastStudentResponse] = useState<string>(""); // last student response sent to the api
  const [studentResponse, setStudentResponse] = useState(""); // student response to the question (contains the answer the student is typing)
  const [focus, setFocus] = useState(""); // some aditionnal request from the student: ex: the lesson is about the history of the USA, and the student wants the questions to focus on the 20th century
  const [chapters, setChapters] = useState<string[]>([]); // chapters detected by the gpt in the lecture

  useEffect(() => { // if the subject is set and lectureContent != [], then unlock the START button
    if (subject != "" && lectureContent.length > 0) {
      setIsReady(true);
    }
  }, [subject, lectureContent]);


  async function handleSubmit() { // handle the student response
    if (studentResponse == "" || isQuestionLoading || lastStudentResponse == studentResponse) {
      return;
    }

    // add the student response to the history
    const messages = [...history, { role: "user", content: studentResponse }];
    setHistory(messages);
    setLastStudentResponse(studentResponse);
    setStudentResponse("");

    // request the api
    setIsAnswerLoading(true);
    const newHistory = await requestGpt(openai, messages);
    setIsAnswerLoading(false);

    // set the history
    setHistory(newHistory);
    // set the api response
    console.log("new response: ", newHistory[newHistory.length - 1].content);
    setApiResponse(formatAnswer(newHistory[newHistory.length - 1].content));
  };


  async function handleStart() { // preprompt the gpt 
    setPreprompting(true);
    // send the preprompt to the gpt
    const prepromtOutput = await prepromptGpt(openai, subject, lectureContent, focus);
    const chapters = prepromtOutput.chapters;
    console.log("chapters detected by model: ", chapters);
    setChapters(chapters);
    const newHistory = prepromtOutput.history;

    console.log("preprompt history", newHistory);

    // set the history
    setHistory(newHistory);
    // set the api question
    console.log("new question: ", newHistory[newHistory.length - 1].content);
    setApiQuestion(formatQuestion(newHistory[newHistory.length - 1].content));

    setPreprompting(false);
    setIsAskingQuestion(true);
    setLastStudentResponse("");
    setStudentResponse("");
  };

  async function handleNextQuestion() { // request gpt to ask another question
    setLastStudentResponse(studentResponse);
    const messages = [...history, { role: "user", content: NEXT_QUESTION_MSG(chapters) }];
    setStudentResponse("");

    // request new question
    setIsQuestionLoading(true);
    const newHistory = await requestGpt(openai, messages);
    setIsQuestionLoading(false);

    // set the history
    setHistory(newHistory);
    // set the api question
    console.log("new question: ", newHistory[newHistory.length - 1].content);
    setApiQuestion(formatQuestion(newHistory[newHistory.length - 1].content));
    setApiResponse("");
  };

  return (
    <div className="App">

      {
        !isAskingQuestion &&
        <div>
          <h1>Subject:</h1>
          <p>The subject of the lecture. It could be specific (the taylor series) or general (mathematics). You can also add the level (college, ...)</p>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} />
          <h1>Lecture:</h1>
          <p>The content of the lecture. You can add as many lines as you want</p>
          <textarea value={lectureContent} onChange={e => setLecture(e.target.value)} />
          <h1>Focus: (optional)</h1>
          <p>This will help the AI to focus on a specific part of the lecture</p>
          <p>Ex: if the lecture is about the history of the USA, and the focus is "20th century", then the AI will focus on the 20th century</p>
          <input type="text" value={focus} onChange={e => setFocus(e.target.value)} />
          <button disabled={!isReady} onClick={handleStart}>Start</button>
          {
            preprompting &&
            <p>Please wait, preprompt in progress</p>
          }
        </div>
      }
      {
        isAskingQuestion &&
        <div>
          <h1>Question:</h1>
          <p>{isQuestionLoading ? "Generating question ..." : apiQuestion}</p>
          < input type="text" value={studentResponse} onChange={e => setStudentResponse(e.target.value)} />
          <button onClick={handleSubmit}>Submit answer</button>
          <h1>Your response: </h1>
          <p>{lastStudentResponse}</p>
          <h1>Teacher response:</h1>
          {
            isAnswerLoading &&
            <p>Please wait, answer in progress</p>
          }
          <p>{apiResponse}</p>
          {/* button to ask more information about the last answer */}
          <button onClick={handleNextQuestion}>Ask another question</button>
          {/* button to get a new question */}
        </div>
      }
      {/* TODO: create ask question button to allow the student to get more detailed information about something they wonder bout the lecture*/}
      <p>{history.map((elem) => elem.content)}</p>
    </div>
  );
}

export default App;
