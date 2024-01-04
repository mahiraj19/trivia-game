import React from 'react';

interface ResultsProps {
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
}

const ResultsPage: React.FC<ResultsProps> = ({ totalQuestions, totalCorrect, totalIncorrect }) => {
  return (
    <div>
      <h2>Results</h2>
      <p>Total Questions Served: {totalQuestions}</p>
      <p>Total Correct Questions: {totalCorrect}</p>
      <p>Total Incorrect Questions: {totalIncorrect}</p>
    </div>
  );
};

export default ResultsPage;
