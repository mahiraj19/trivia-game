import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
const axios = require('axios');
import App from './App';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedQuestions = [
  {
    category: 'General Knowledge',
    question: 'What is the capital of France?',
    correct_answer: 'Paris',
    incorrect_answers: ['Berlin', 'Madrid', 'Rome'],
  },
];

describe('App component', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: { results: mockedQuestions } });
  });

  test('renders loading state initially', async () => {
    const { getByText } = render(<App />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  test('renders questions after fetching', async () => {
    const { getByText, getByLabelText } = render(<App />);
    await waitFor(() => expect(getByText('What is the capital of France?')).toBeInTheDocument());
    expect(getByLabelText('Paris')).toBeInTheDocument();
    expect(getByLabelText('Berlin')).toBeInTheDocument();
    expect(getByLabelText('Madrid')).toBeInTheDocument();
    expect(getByLabelText('Rome')).toBeInTheDocument();
  });

  test('submits answer and shows result', async () => {
    const { getByText, getByLabelText } = render(<App />);
    await waitFor(() => expect(getByText('What is the capital of France?')).toBeInTheDocument());

    fireEvent.click(getByLabelText('Paris'));
    fireEvent.click(getByText('Submit'));

    await waitFor(() => expect(getByText('Correct!')).toBeInTheDocument());
    expect(getByText('Next')).toBeInTheDocument();
  });

  test('handles next question', async () => {
    const { getByText, getByLabelText } = render(<App />);
    await waitFor(() => expect(getByText('What is the capital of France?')).toBeInTheDocument());

    fireEvent.click(getByLabelText('Paris'));
    fireEvent.click(getByText('Submit'));

    await waitFor(() => expect(getByText('Correct!')).toBeInTheDocument());

    fireEvent.click(getByText('Next'));

    await waitFor(() => expect(getByText('What is the capital of Germany?')).toBeInTheDocument());
  });
});
