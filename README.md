# Knowledge Quiz

A browser-based multiple-choice quiz built with HTML, CSS, and vanilla JavaScript. Open `index.html` in a browser. No install or server is required.

## How to play

1. The welcome screen shows the quiz title, a short description, the number of questions, and **Start Quiz**.
2. Each question appears on its own card. The header shows the question number, progress, score, and a 60-second timer.
3. Choose an answer. The selected button turns green when it is correct and red when it is wrong. The correct answer is highlighted, and the other buttons lock.
4. A correct answer adds 1 point. A wrong answer subtracts 1 point. The score never goes below 0.
5. **Next Question** moves forward after an answer. On the last card it becomes **See results**.
6. If the minute runs out, the question is marked unanswered, the score drops by 1 (still not below 0), and the quiz moves on.
7. The results screen shows the final score, correct, incorrect, and unanswered counts, plus a review of every question. **Restart Quiz** returns to the welcome screen.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Welcome, quiz, and results screens |
| `styles.css` | Layout, card, and answer states |
| `quiz.js` | Questions, scoring, timer, and results |

## Add a question

Questions live in the `QUESTIONS` array at the top of `quiz.js`. `answer` is the index of the correct option, starting at 0.

```js
{
  question: "What does HTML stand for?",
  options: [
    "Hyper Text Markup Language",
    "High Transfer Markup Language",
    "Home Tool Markup Language",
    "Hyperlink Text Management Language"
  ],
  answer: 0
}
```

The welcome screen counts questions from this array, so a new item appears automatically.
