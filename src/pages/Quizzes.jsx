import React, { useEffect, useState } from "react";
import axios from "axios";

const Quizzes = ({ user }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState("");

  // Load quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await axios.get("http://localhost:4000/api/quizzes");
      setQuizzes(res.data);
    };
    fetchQuizzes();
  }, []);

  // Generate quiz with AI
  const generateQuiz = async () => {
    const res = await axios.post("http://localhost:4000/api/quizzes/generate", {
      topic,
    });
    setQuizzes([res.data, ...quizzes]);
    setTopic("");
  };

  // Upload quiz file
  const uploadQuiz = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(
      "http://localhost:4000/api/quizzes/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    setQuizzes([res.data, ...quizzes]);
    setFile(null);
  };

  // Handle quiz answer
  const handleAnswer = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  // Submit quiz
  const submitQuiz = async () => {
    let correct = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });

    setScore(correct);

    await axios.post("http://localhost:4000/api/quizzes/submit", {
      userId: user.id,
      quizId: selectedQuiz._id,
      score: correct,
      total: selectedQuiz.questions.length,
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📚 Quizzes</h2>

      {/* Generate quiz */}
      <div>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic"
        />
        <button onClick={generateQuiz}>Generate Quiz</button>
      </div>

      {/* Upload quiz */}
      <div>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadQuiz}>Upload Quiz</button>
      </div>

      {/* Quiz list */}
      <h3>Available Quizzes</h3>
      <ul>
        {quizzes.map((q) => (
          <li key={q._id}>
            {q.title} ({q.difficulty}){" "}
            <button onClick={() => setSelectedQuiz(q)}>Take Quiz</button>
          </li>
        ))}
      </ul>

      {/* Take quiz */}
      {selectedQuiz && (
        <div>
          <h3>{selectedQuiz.title}</h3>
          {selectedQuiz.questions.map((q, idx) => (
            <div key={idx}>
              <p>
                {idx + 1}. {q.question}
              </p>
              {q.options.map((opt) => (
                <label key={opt} style={{ marginRight: "10px" }}>
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    onChange={() => handleAnswer(idx, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={submitQuiz}>Submit Quiz</button>
          {score !== null && (
            <p>
              ✅ You scored {score} / {selectedQuiz.questions.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
