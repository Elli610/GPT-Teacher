# GPT-teacher
This is a quick IA project which allows anyone to be interrogated about their lectures by the chat GPT api.

When  you run the program, you can choose the subject of the lecture and then, paste your lecture content in the `Lecture` part. Then, the model will be preprompted with the subject and the lecture content and will be able to ask you questions about it.
As a student, you can then answer the questions and the model will be able to correct you if you are wrong.

## usage

- clone the repo
- run `npm install`
- paste you openAI api key in the `src/app.ts` file (YOUR_API_KEY) (it didn't work with the .env file and I didn't have time to fix it)
- run `npm start`
- go to `localhost:3000` in your browser
- enjoy !

### Interesting part for my ai teacher:

- `src/constant.ts` contains the messages used to preprompt the model. Some comments are added to explain what they are used for and why I chose them instead of others.
- `src/gpt/preprompt.ts` contains the function which preprompt the model. It contains all the preprompt process the model and to get the answer from it.
- `src/App.tsx` contains the main part of the program. It contains all the front end logic 
- some examples of lectures are available in the `lectures` folder. You can use them to test the program.