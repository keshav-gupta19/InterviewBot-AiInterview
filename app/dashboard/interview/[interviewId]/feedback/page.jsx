"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDownIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FeedBack = ({ params }) => {
  const Router = useRouter();
  const [FeedbackList, setFeedbackList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const GetFeedBack = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockId, params.interviewId))
        .orderBy(UserAnswer.id);

      console.log(result);
      setFeedbackList(result);
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching interview details:", error);
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetFeedBack();
  }, []);
  return (
    <>
      <div className="p-10">
        <h2 className="text-2xl font-bold text-green-500">Congratulations!</h2>
        <h2 className="font-bold text-2xl">Here is your feedback</h2>
        <h2 className="text-primary text-lg my-3">
          {FeedbackList.length === 0 ? (
            <>Start Your Interview</>
          ) : (
            <>
              Your Overall interview rating: <strong>7/10</strong>
            </>
          )}
        </h2>

        <h2 className="text-sm text-gray-500">
          Find below your overall Rating and detailed feedback of each question
          with it's correct answer.
        </h2>
        {Loading ? (
          <>
            <LoaderCircleIcon className="animate-spin" />
          </>
        ) : (
          <>
            {FeedbackList.length == 0 && (
              <div>
                <Button
                  className="mt-5 text-white mb-7"
                  onClick={() =>
                    Router.replace(
                      `/dashboard/interview/${params.interviewId}/start`
                    )
                  }
                >
                  Start Interview
                </Button>
              </div>
            )}
            {FeedbackList.length > 0 &&
              FeedbackList.map((item, index) => (
                <div>
                  <Collapsible key={index} className="mt-7">
                    <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 flex justify-between gap-4 w-full">
                      {item.question} <ChevronsUpDownIcon className="h-5 w-5" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-red-500 p-2 border rounder-lg">
                          <strong>Rating: </strong>
                          {item.rating}
                        </h2>
                        <h2 className="p-2 border rounder-lg bg-red-50 text-sm">
                          <strong>Your Answer</strong>: {item.userAns}
                        </h2>
                        <h2 className="p-2 border rounder-lg bg-green-50 text-sm">
                          <strong>Correct Answer</strong>: {item.correctAns}
                        </h2>
                        <h2 className="p-2 border rounder-lg bg-blue-100 text-primary">
                          <strong>Feedback</strong>: {item.feedback}
                        </h2>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            <div>
              <Button
                onClick={() => {
                  Router.replace("/dashboard");
                }}
              >
                Go Home
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FeedBack;
