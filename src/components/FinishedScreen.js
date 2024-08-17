import React from "react";

export default function FinishedScreen({
  points,
  maxPossiblePoint,
  highScore,
  dispatch,
}) {
  const percentage = (points / maxPossiblePoint) * 100;
  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 50 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤔";
  if (percentage === 0) emoji = "🤦‍♂️";
  return (
    <>
      <p className="result">
        <span>{emoji}</span> Your Scored <strong>{points}</strong> out of{" "}
        {maxPossiblePoint}({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore : {highScore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart quiz
      </button>
    </>
  );
}
