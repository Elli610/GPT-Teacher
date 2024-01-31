import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

import OpenAIApi from 'openai';
import { prepromptGPT } from './gpt/prepromptGPT';
import { sendAnswer } from './gpt/sendAnswer';
import { formatAnswer, formatQuestion } from './format';

const YOUR_API_KEY = ;

const openai = new OpenAIApi({ apiKey: YOUR_API_KEY, dangerouslyAllowBrowser: true });

// main();
function App() {

  const [subject, setSubject] = useState(""); // subject of the lecture
  const [lectureContent, setLecture] = useState<string[]>([]); // lecture content
  const [isReady, setIsReady] = useState(false);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false); // if true, then the gpt is asking a question
  const [preprompting, setPreprompting] = useState(false); // if true, then the gpt is preprompting

  const [apiQuestion, setApiQuestion] = useState(""); // question to answer to the api
  const [apiResponse, setApiResponse] = useState(""); // api reaction to the student response
  const [lastStudentResponse, setLastStudentResponse] = useState(""); // last student response sent to the api
  const [studentResponse, setStudentResponse] = useState(""); // student response to the question (contains the answer the student is typing)


  useEffect(() => { // if the subject is set and lectureContent != [], then unlock the START button
    if (subject != "" && lectureContent.length > 0) {
      setIsReady(true);
    }
  }, [subject, lectureContent]);


  async function handleSubmit() {
    if(studentResponse == "") {
      return;
    }
    console.log("submitting");
    setLastStudentResponse(studentResponse);
    setStudentResponse("");
    sendAnswer(openai, apiQuestion, lectureContent, lastStudentResponse).then((response) => {
      console.log("is correct: " + response);
      setApiResponse(formatAnswer(response));
    });
  };


  async function handleStart() { // preprompt the gpt 
    console.log("starting");
    setPreprompting(true);
    prepromptGPT(openai, subject, lectureContent).then((question) => {
      setApiQuestion(formatQuestion(question));
      setPreprompting(false);
      setIsAskingQuestion(true);
    });
  };

  return (
    <div className="App">

      {
        !isAskingQuestion &&
        <div>
          <h1>Subject:</h1>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} />
          <h1>Lecture:</h1>
          <textarea value={lectureContent.join("\n")} onChange={e => setLecture(e.target.value.split("\n"))} />
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
          <p>{apiQuestion}</p>
          < input type="text" value={studentResponse} onChange={e => setStudentResponse(e.target.value)} />
          <button onClick={handleSubmit}>Submit answer</button>
          <h1>Your response: </h1>
          <p>{lastStudentResponse}</p>
          <h1>Teacher response:</h1>
          <p>{apiResponse}</p>
        </div>
      }
      {/* TODO: create ask question button */}
    </div>
  );
}

export default App;
