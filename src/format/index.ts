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
    } else if (json.message) {
      output += json.message;
    }
    
    if (json.options) {
      output += "\nOptions:\n" + json.options.join("\n\t- ");
    } else if (json.choices) {
      output += "\nChoices:\n" + json.choices.join("\n\t- ");
    }

    if (output.length > 0) return output;
    else return question;
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
    } else if (json.correct || json.correct === false) {
      output += json.correct;
    } else if (json.result) {
      output += json.result;
    }

    if (json.explanation) {
      output += "\nExplanation:\n" + json.explanation;
    }

    if (output.length > 0) return output;
    else return answer;

  } catch (e) {
    return answer;
  }
}