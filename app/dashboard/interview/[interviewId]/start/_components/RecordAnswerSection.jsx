"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { StopCircleIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

const RecordAnswerSection = ({ questions, activeQuestion, interviewData }) => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const userAnswerRef = useRef("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  useEffect(() => {
    const combinedResult = results.map((result) => result.transcript).join(" ");
    setUserAnswer(combinedResult);
    userAnswerRef.current = combinedResult;
  }, [results]);

  useEffect(() => {
    console.log("userAnswer", userAnswer);
  }, [userAnswer]);

  const handleRecording = async () => {
    if (isRecording) {
      setLoading(true);
      stopSpeechToText();
      setTimeout(async () => {
        if (userAnswerRef.current.length < 10) {
          console.log(userAnswerRef.current);
          toast("Answer not recorded properly. Please try again");
          setLoading(false);
          return;
        }
        console.log(userAnswerRef.current);
        const feedbackPrompt = `Question: ${questions[activeQuestion].question}, User Answer: ${userAnswerRef.current}. Depends on question and User answer, Please give me the rating (On scale of 1-5) and feedback for this answer as this is answer which user tells to the interviewer. Give me the output in json format with rating field and feedback field which contains the steps to improve it in not more than 3-5 lines.`;

        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResponse = result.response
          .text()
          .replace("```json", "")
          .replace("```", "");

        console.log(mockJsonResponse);

        const JsonFeedbackResponse = JSON.parse(mockJsonResponse);

        const res = await db.insert(UserAnswer).values({
          mockId: interviewData?.mockId,
          question: questions[activeQuestion]?.question,
          correctAns: questions[activeQuestion]?.answer,
          userAns: userAnswerRef.current,
          feedback: JsonFeedbackResponse?.feedback,
          rating: JsonFeedbackResponse?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        });

        if (res) {
          toast("User Answer Recorded Successfully!");
          setResults([]);
        }
        setLoading(false);
        setResults([]);
      }, 2000);
    } else {
      startSpeechToText();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center bg-black rounded-lg mt-20">
        <Image
          src={"/webcam_final.png"}
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{ height: 300, width: "100%", zIndex: 10 }}
        />
      </div>
      <Button
        variant="outline"
        className="my-10"
        onClick={handleRecording}
        disables={loading}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2 animate-pulse">
            <StopCircleIcon /> Stop Recording
          </h2>
        ) : (
          "Start Recording"
        )}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;
