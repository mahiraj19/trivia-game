import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Question {
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [validationError, setValidationError] = useState<string>('');
  const [loading, setLoading] = useState(true); // New state to track loading state
  const [showNextButton, setShowNextButton] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10');
        const formattedQuestions = response.data.results.map((result: any) => ({
          category: result.category,
          question: result.question,
          correct_answer: result.correct_answer,
          incorrect_answers: result.incorrect_answers,
        }));
        setQuestions(formattedQuestions);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    setValidationError('');
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!selectedAnswer) {
      setValidationError('Please select an answer before submitting.');
      return;
    }

    if (selectedAnswer === currentQuestion.correct_answer) {
      setResult('Correct!');
      setCorrectCount((count) => count + 1);
    } else {
      setResult(`Wrong! Correct answer: ${currentQuestion.correct_answer}`);
      setIncorrectCount((count) => count + 1);
    }

    setShowNextButton(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setResult(null);
    setValidationError('');
    setShowNextButton(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((index) => index + 1);
    } else {
      alert(`Total Questions: ${questions.length}\nCorrect: ${correctCount}\nIncorrect: ${incorrectCount}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions found.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answerOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

  return (
    <div>
      <h2>{currentQuestion.category}</h2>
      <p>
        Question {currentQuestionIndex + 1} of {questions.length}: {currentQuestion.question}
      </p>
      <div>
        {answerOptions.map((answer) => (
          <div key={answer}>
            <input
              type="radio"
              id={answer}
              name="answer"
              value={answer}
              checked={selectedAnswer === answer}
              onChange={() => handleAnswerSelection(answer)}
            />
            <label htmlFor={answer}>{answer}</label>
          </div>
        ))}
      </div>

      <button onClick={handleSubmitAnswer}>Submit</button>
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
      {result && <p>{result}</p>}
      {showNextButton && <button onClick={handleNextQuestion}>Next</button>}
    </div>
  );
};

export default App;
