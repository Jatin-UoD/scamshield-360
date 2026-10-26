import { useState } from 'react';
import { SAFETY_TIPS, QUIZ_QUESTIONS } from '../data/learning';

export function Learning() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplain, setShowExplain] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[qIndex];

  const startQuiz = () => {
    setQuizStarted(true);
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setShowExplain(false);
    setFinished(false);
  };

  const submitAnswer = () => {
    if (selected === null) return;
    if (selected === q.correctIndex) setScore((s) => s + 1);
    setShowExplain(true);
  };

  const next = () => {
    if (qIndex + 1 >= QUIZ_QUESTIONS.length) {
      setFinished(true);
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setShowExplain(false);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>
          Practical cyber-safety tips
        </h3>
        <div className="grid grid-2">
          {SAFETY_TIPS.map((tip) => (
            <div
              key={tip.title}
              style={{
                padding: '0.85rem',
                background: 'var(--bg-deep)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <strong style={{ fontSize: '0.9rem' }}>{tip.title}</strong>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {tip.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Interactive quiz</h3>
          {quizStarted && !finished && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Question {qIndex + 1} / {QUIZ_QUESTIONS.length}
            </span>
          )}
        </div>

        {!quizStarted && (
          <div className="empty-state">
            <h3>Test your awareness</h3>
            <p>{QUIZ_QUESTIONS.length} multiple-choice questions with explanations after each answer.</p>
            <button type="button" className="btn btn-primary" onClick={startQuiz}>
              Start quiz
            </button>
          </div>
        )}

        {quizStarted && !finished && q && (
          <div>
            <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{q.question}</p>
            {q.options.map((opt, idx) => {
              let cls = 'quiz-option';
              if (showExplain) {
                if (idx === q.correctIndex) cls += ' correct';
                else if (idx === selected) cls += ' wrong';
              } else if (selected === idx) cls += ' selected';
              return (
                <button
                  key={idx}
                  type="button"
                  className={cls}
                  disabled={showExplain}
                  onClick={() => setSelected(idx)}
                >
                  {opt}
                </button>
              );
            })}

            {showExplain && (
              <div className="alert alert-info" style={{ marginTop: '0.75rem' }}>
                {q.explanation}
              </div>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              {!showExplain ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={selected === null}
                  onClick={submitAnswer}
                >
                  Check answer
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={next}>
                  {qIndex + 1 >= QUIZ_QUESTIONS.length ? 'See score' : 'Next question'}
                </button>
              )}
            </div>
          </div>
        )}

        {finished && (
          <div className="empty-state">
            <h3>
              Score: {score} / {QUIZ_QUESTIONS.length}
            </h3>
            <p>
              {score === QUIZ_QUESTIONS.length
                ? 'Excellent — you spotted the key red flags.'
                : score >= QUIZ_QUESTIONS.length / 2
                  ? 'Good progress. Review the tips above for the questions you missed.'
                  : 'Worth revisiting the safety tips and CyberSahayak guidance.'}
            </p>
            <button type="button" className="btn btn-primary" onClick={startQuiz}>
              Retake quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
