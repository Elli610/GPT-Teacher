/**
 * try to parse the question to make it more readable. If fails, return the question as is
 * 
 * @param question 
 * @returns 
 */
export function formatQuestion(question: string): string {
  try {
    let output = "";

    const json = JSON.parse(question);

    if (json.question) {
      output += json.question;
    }
    if (json.options) {
      output += "\nOptions:\n" + json.options.join("\n\t- ");
    }

    return output;
  } catch (e) {
    return question;
  }

}

/**
 * try to parse the answer to make it more readable. If fails, return the answer as is
 * 
 * @param answer 
 * @returns 
 */
export function formatAnswer(answer: string): string {
  try {
    let output = "";

    const json = JSON.parse(answer);

    if (json.response) {
      output += json.response;
    } else if (json.answer) {
      output += json.answer;
    } else if (json.correct) {
      output += json.correct;
    } else if (json.result) {
      output += json.result;
    }

    if (output.length > 0) return output;
    else return answer;

  } catch (e) {
    return answer;
  }
}