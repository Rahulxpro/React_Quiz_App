import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Timer from "./Timer";
import Footer from "./Footer";

const SEC_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // 'loading , 'error', 'ready , 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secoundsRemaing: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secoundsRemaing: state.questions.length * SEC_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case `"nextQuestion"`:
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      }; // all; are initial  state =0 , point =0,highscore=0,index=0,answe=null, status = ready
    case "tick":
      return {
        ...state,
        secoundsRemaing: state.secoundsRemaing - 1,
        status: state.secoundsRemaing === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown ");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highScore, secoundsRemaing },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestion = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestion={numQuestion} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestion={numQuestion}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secoundsRemaing={secoundsRemaing} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestion={numQuestion}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPossiblePoint={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
