function SummaryCards({ summary }) {
  return (
    <div className="summary-cards">
      <div className="card">
        <h3>Total Activities</h3>
        <p className="number">{summary.totalActivities}</p>
      </div>
      <div className="card">
        <h3>Lesson Plans</h3>
        <p className="number">{summary.lessonPlans}</p>
      </div>
      <div className="card">
        <h3>Quizzes</h3>
        <p className="number">{summary.quizzes}</p>
      </div>
      <div className="card">
        <h3>Question Papers</h3>
        <p className="number">{summary.questionPapers}</p>
      </div>
    </div>
  );
}

export default SummaryCards;
