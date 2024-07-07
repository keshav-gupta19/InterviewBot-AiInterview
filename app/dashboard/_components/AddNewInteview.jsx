"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [jobExp, setJobExp] = useState("");
  const [Loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);

  const Router = useRouter();
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(jobDescription, jobPosition, jobExp);

    const InputPrompt = `Generate six interview questions and their answers based on the following details:
      Job Position: ${jobPosition}
      Job Description: ${jobDescription}
      Job Experience: ${jobExp}
      Give me the data in JSON format. Saying it again... Data in Json Format.
      `;

    try {
      setLoading(true);
      const result = await chatSession.sendMessage(InputPrompt);
      const output = result.response.text();
      const JsonResponse = output.replace("```json", "").replace("```", "");
      // console.log(JsonResponse);
      const responseJson = JSON.parse(JsonResponse);
      console.log(responseJson);
      setJsonResponse(responseJson);
      if (responseJson) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: JsonResponse,
            jobDesc: jobDescription,
            jobExperience: jobExp,
            jobPosition: jobPosition,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .returning({ mockId: MockInterview.mockId });

        console.log("inserted", resp);
        if (resp) {
          setOpenDialog(false);
          Router.push(`/dashboard/interview/${resp[0].mockId}`);
        }
      } else {
        console.log("Error in generating questions");
      }
    } catch (error) {
      setLoading(true);
      console.error("Error generating interview questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog
        open={openDialog}
        className="max-w-2xl"
        onOpenChange={setOpenDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about the job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role, job description
                    and years of Experience.
                    <div className="mt-7 my-3">
                      <label>Job Title/Job Role</label>
                      <Input
                        placeholder="Ex. Full Stack Developer, LLM Engineer etc."
                        required
                        onChange={(e) => setJobPosition(e.target.value)}
                      />
                    </div>
                    <div className="mt-7 my-3">
                      <label>Job Description/ Tech Stack</label>
                      <Textarea
                        placeholder="Ex. React, NodeJs, Angular, MySql etc."
                        required
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                    </div>
                    <div className="mt-7 my-3">
                      <label>Years of Experience</label>
                      <Input
                        placeholder="Ex. 0, 1, 2 etc."
                        type="number"
                        required
                        onChange={(e) => setJobExp(e.target.value)}
                        max={50}
                      />
                    </div>
                  </h2>
                </div>
                <div className="mt-5 flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {Loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        {"Generating from AI..."}
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
