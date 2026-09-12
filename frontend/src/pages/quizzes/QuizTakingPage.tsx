import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'

type Question = {
  id: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  points: number
}

type Quiz = {
  id: number
  title: string
  description: string
  disaster_type: string
  questions: Question[]
}

type QuestionResult = {
  question_id: number
  selected_option: string | null
  correct_option: string
  explanation: string
  is_correct: boolean
  points_earned: number
  points: number
}

type Result = {
  id: number
  quiz_id: number
  score: number
  total_points: number
  results: QuestionResult[]
}

function QuizTakingPage() {
  const { quizId } = useParams()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/api/quizzes/${quizId}`)
        setQuiz(response.data)
      } catch (error) {
        console.error('Failed to load quiz:', error)
        setError('Failed to load quiz.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  const getOptionText = (question: Question, option: string | null) => {
    if (!option) return 'Not answered'

    const options: Record<string, string> = {
      A: question.option_a,
      B: question.option_b,
      C: question.option_c,
      D: question.option_d,
    }

    return options[option] || option
  }

  const handleSubmit = async () => {
    if (!quiz) return

    if (Object.keys(answers).length !== quiz.questions.length) {
      setError('Please answer all questions before submitting.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const response = await api.post(
        `/api/quizzes/${quiz.id}/submit`,
        { answers },
      )

      setResult(response.data)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      setError('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">{error || 'Quiz not found.'}</p>
        <Link
          to="/quizzes"
          className="mt-4 inline-block text-blue-600"
        >
          ← Back to Quizzes
        </Link>
      </div>
    )
  }

  const percentage = result
    ? Math.round((result.score / result.total_points) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900"
          >
            Disaster<span className="text-blue-600">Safe</span>
          </Link>

          <Link
            to="/quizzes"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← All Quizzes
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {quiz.disaster_type} Safety
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {quiz.title}
          </h1>

          <p className="mt-2 text-gray-600">
            {quiz.description}
          </p>
        </div>

        {result ? (
          <>
            {/* Score */}
            <div className="mb-8 rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="text-5xl font-bold text-blue-600">
                {percentage}%
              </div>

              <h2 className="mt-3 text-2xl font-bold text-gray-900">
                Quiz Completed 🎉
              </h2>

              <p className="mt-2 text-gray-600">
                You scored {result.score} out of {result.total_points} points.
              </p>
            </div>

            {/* Answer Review */}
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Answer Review
              </h2>

              {result.results.map((item, index) => {
                const question = quiz.questions.find(
                  (q) => q.id === item.question_id,
                )

                if (!question) return null

                return (
                  <div
                    key={item.question_id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-gray-500">
                        Q{index + 1}.
                      </span>

                      <h3 className="font-semibold text-gray-900">
                        {question.question}
                      </h3>
                    </div>

                    {/* Your answer */}
                    <div
                      className={`mt-5 rounded-lg border p-4 ${
                        item.is_correct
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        Your answer
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {item.selected_option
                          ? `${item.selected_option}. ${getOptionText(
                              question,
                              item.selected_option,
                            )}`
                          : 'Not answered'}
                      </p>

                      <p
                        className={`mt-2 text-sm font-semibold ${
                          item.is_correct
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}
                      >
                        {item.is_correct
                          ? '✓ Correct'
                          : '✗ Incorrect'}
                      </p>
                    </div>

                    {/* Correct answer */}
                    {!item.is_correct && (
                      <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-4">
                        <p className="text-sm font-semibold text-green-800">
                          Correct answer
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {item.correct_option}.{' '}
                          {getOptionText(
                            question,
                            item.correct_option,
                          )}
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm font-semibold text-blue-800">
                        💡 Why?
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-700">
                        {item.explanation}
                      </p>
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-500">
                      Points: {item.points_earned}/{item.points}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-8">
              <Link
                to="/quizzes"
                className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                ← Back to Quizzes
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Questions */}
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const options = [
                  ['A', question.option_a],
                  ['B', question.option_b],
                  ['C', question.option_c],
                  ['D', question.option_d],
                ]

                return (
                  <div
                    key={question.id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <h2 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {question.question}
                    </h2>

                    <div className="mt-5 space-y-3">
                      {options.map(([letter, text]) => (
                        <label
                          key={letter}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                            answers[question.id] === letter
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={letter}
                            checked={
                              answers[question.id] === letter
                            }
                            onChange={() =>
                              setAnswers((current) => ({
                                ...current,
                                [question.id]: letter,
                              }))
                            }
                          />

                          <span className="font-semibold">
                            {letter}.
                          </span>

                          <span className="text-gray-700">
                            {text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {error && (
              <p className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-8 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </>
        )}
      </main>
    </div>
  )
}

export default QuizTakingPage