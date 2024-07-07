"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSections from "./_components/QuestionsSections";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const Router = useRouter();
  const [activeQuestion, setActiveQuestion] = useState(0);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, params.interviewId));

        if (result.length > 0) {
          const jsonResp = JSON.parse(result[0].jsonMockResp);
          setInterviewData(result[0]);
          setQuestions(jsonResp);
        }
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };

    if (params.interviewId) {
      fetchInterviewDetails();
    }
  }, [params.interviewId]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Questions */}
        <QuestionsSections
          questions={questions}
          activeQuestion={activeQuestion}
        />

        <RecordAnswerSection
          questions={questions}
          activeQuestion={activeQuestion}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestion !== 0 && (
          <Button onClick={() => setActiveQuestion(activeQuestion - 1)}>
            Previous Question
          </Button>
        )}
        {activeQuestion !== questions.length - 1 && (
          <Button onClick={() => setActiveQuestion(activeQuestion + 1)}>
            Next Question
          </Button>
        )}
        {activeQuestion === questions.length - 1 && (
          <Button
            onClick={() =>
              Router.push(`/dashboard/interview/${params.interviewId}/feedback`)
            }
          >
            End Interview
          </Button>
        )}
      </div>
    </>
  );
};

export default StartInterview;
