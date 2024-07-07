"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

const QuestionsSections = ({ questions, activeQuestion }) => {
  const textToSpeech = (questionToSpeak) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(questionToSpeak);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Your Browser does not Support Text to Speech");
    }
  };

  return (
    <div className="p-5 border rounded-lg mt-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {questions &&
          questions.map((question, index) => (
            <h2
              key={index}
              className={`p-2 rounded-full text-sm md:text-sm text-center cursor-pointer ${
                activeQuestion === index ? "text-white" : ""
              }`}
              style={{
                backgroundColor:
                  activeQuestion === index ? "#4845D2" : "#F3F4F6",
              }}
            >
              Question #{index + 1}
            </h2>
          ))}
      </div>
      <h2 className="my-5 text-md md:text-lg">
        {questions[activeQuestion] && questions[activeQuestion].question}
      </h2>

      {questions[activeQuestion] && (
        <Volume2
          className="cursor-pointer"
          onClick={() => textToSpeech(questions[activeQuestion].question)}
        />
      )}

      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="text-sm text-primary my-2">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}{" "}
        </h2>
      </div>
    </div>
  );
};

export default QuestionsSections;
