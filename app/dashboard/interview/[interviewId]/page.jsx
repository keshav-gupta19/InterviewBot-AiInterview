"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import {
  Lightbulb,
  LoaderCircle,
  LoaderPinwheel,
  WebcamIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [enabledWebcam, setEnabledWebcam] = useState(false);

  const Router = useRouter();
  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, params.interviewId));
        setInterviewData(result[0]);
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };

    if (params.interviewId) {
      fetchInterviewDetails();
    }
  }, [params.interviewId]);

  useEffect(() => {
    console.log(interviewData);
  }, [interviewData]);

  return (
    <div className="my-10 flex justify-center flex-col items-center">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {interviewData ? (
          <div className="flex flex-col my-5 gap-5">
            <div className="flex flex-col my-5 gap-5 items-center justify-center p-5 rounded-lg border">
              <h2 className="text-lg">
                <strong>Job Role/Job Position:</strong>{" "}
                {interviewData.jobPosition}
              </h2>
              <h2 className="text-lg">
                <strong>Job Description:</strong> {interviewData.jobDesc}
              </h2>
              <h2 className="text-lg">
                <strong>Years of Experience:</strong>{" "}
                {interviewData.jobExperience}
              </h2>
            </div>
            <div className="p-5 rounded-lg border border-yellow-300 bg-yellow-100">
              <h2 className="flex gap-2 items-center text-yellow-700">
                <Lightbulb />
                <strong>Information</strong>
              </h2>
              <h2 className="mt-3 text-yellow-500">
                {process.env.NEXT_PUBLIC_ALERT_INFP}
              </h2>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
        <div>
          {enabledWebcam ? (
            <Webcam
              onUserMedia={() => setEnabledWebcam(true)}
              onUserMediaError={() => setEnabledWebcam(false)}
              style={{
                height: 300,
                width: 300,
              }}
              mirrored={true}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary" />
              <Button
                onClick={() => setEnabledWebcam(true)}
                className="flex items-center justify-center w-full"
                variant="outline"
              >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div
        className="flex justify-end items-end"
        style={{ width: "-webkit-fill-available" }}
      >
        <Button
          onClick={() => {
            Router.push(`/dashboard/interview/${params.interviewId}/start`);
          }}
        >
          Start Interview
        </Button>
      </div>
    </div>
  );
};

export default Interview;
