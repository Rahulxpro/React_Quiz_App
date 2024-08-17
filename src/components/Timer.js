import { useEffect } from "react";

export default function Timer({ dispatch, secoundsRemaing }) {
  const mins = Math.floor(secoundsRemaing / 60);
  const secs = secoundsRemaing % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{secs < 10 && "0"}
      {secs}
    </div>
  );
}
