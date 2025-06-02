"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Briefcase, FileUp, Link as LinkIcon, Loader2, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";

interface JobInfo {
  title: string;
  company: string;
  skills: string[];
}

const formSchema = z.object({
  jobUrl: z.string().url({ message: "Please enter a valid job URL" }),
  interviewType: z.enum(["hr", "technical", "manager"], {
    required_error: "Please select an interview type",
  }),
  duration: z.enum(["1", "5", "10", "15", "30", "45"], {
    required_error: "Please select an interview duration",
  }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Please select a difficulty level",
  }),
  language: z.enum(["English", "French"], {
    required_error: "Please select a language",
  }),
});

export default function NewInterviewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cvPath, setCvPath] = useState<string | null>(null);
  const [coverLetterPath, setCoverLetterPath] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobUrl: "",
      interviewType: "hr",
      duration: "30",
      difficulty: "medium",
      language: "English",
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10485760, // 10MB
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        console.log("Starting file upload...");
        setUploadProgress(0);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Upload file
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        console.log("Uploading file:", fileName);
        
        const { error: uploadError, data } = await supabase.storage
          .from('cvs')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;
        console.log("File uploaded successfully:", data);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('cvs')
          .getPublicUrl(fileName);

        console.log("Public URL generated:", publicUrl);
        setCvPath(publicUrl);
        toast.success("CV uploaded successfully");
        setUploadProgress(100);
      } catch (error: any) {
        console.error("File upload error:", error);
        toast.error(error.message || "Failed to upload file");
        setUploadProgress(0);
      }
    }
  });

  const analyzeJobUrl = async () => {
    const url = form.getValues("jobUrl");
    if (!url) return;

    setIsAnalyzing(true);
    try {
      console.log("Analyzing job URL:", url);
      // In a real app, this would make an API call to analyze the job posting
      // For demo purposes, we'll simulate the analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setJobInfo({
        title: "Senior Software Engineer",
        company: "Tech Company Inc.",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
      });
      
      console.log("Job analysis complete");
      toast.success("Job posting analyzed successfully");
    } catch (error: any) {
      console.error("Job analysis error:", error);
      toast.error(error.message || "Failed to analyze job posting");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextStep = () => {
    console.log("Moving to next step:", currentStep + 1);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    console.log("Moving to previous step:", currentStep - 1);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submission started with values:", values);
    
    if (!jobInfo) {
      console.log("No job info available, aborting submission");
      toast.error("Please analyze a job posting first");
      return;
    }

    if (isSubmitting) {
      console.log("Already submitting, preventing duplicate submission");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Starting interview creation process...");
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        throw new Error("Not authenticated");
      }
      console.log("User authenticated:", user.id);

      // Create interview
      console.log("Creating interview record...");
      const { data, error } = await supabase
        .from('interviews')
        .insert([
          {
            user_id: user.id,
            job_url: values.jobUrl,
            job_title: jobInfo?.title || "Unknown Position",
            company: jobInfo?.company || "Unknown Company",
            cv_path: cvPath,
            interview_type: values.interviewType,
            status: "in_progress",
            score: 0,
            language: values.language,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      if (!data) {
        console.error("No data returned from insert");
        throw new Error("No data returned from insert");
      }

      console.log("Interview created successfully:", data);
      toast.success("Interview created! Redirecting to interview room...");
      router.push(`/interview/${data.id}/room`);
    } catch (error: any) {
      console.error("Error creating interview:", error);
      toast.error(error.message || "Failed to create interview");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Interview</h2>
        <p className="text-muted-foreground">
          Follow the steps below to set up your interview
        </p>
      </div>

      <div className="space-y-8">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <Progress value={(currentStep / 4) * 100} />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Job URL */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>
                    Enter the URL of the job posting you want to practice for
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="jobUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Posting URL</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring focus-within:border-input pl-3">
                                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="https://example.com/job-posting" 
                                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                  {...field} 
                                />
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              onClick={analyzeJobUrl}
                              disabled={isAnalyzing || !form.getValues("jobUrl")}
                            >
                              {isAnalyzing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                "Analyze"
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Supports LinkedIn, Indeed, Glassdoor, and Welcome to the Jungle
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {jobInfo && (
                    <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                      <h3 className="font-medium">Job Information</h3>
                      <div className="space-y-2">
                        <p><span className="text-muted-foreground">Position:</span> {jobInfo.title}</p>
                        <p><span className="text-muted-foreground">Company:</span> {jobInfo.company}</p>
                        <div>
                          <p className="text-muted-foreground mb-1">Required Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {jobInfo.skills.map((skill, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Document Upload */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload your CV and cover letter (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">CV/Resume</h3>
                      <div 
                        {...getRootProps()} 
                        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <div className="space-y-1 text-center">
                            <p className="font-medium">
                              {cvPath ? "CV uploaded successfully" : "Drag & drop your CV here"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, DOC, or DOCX up to 10MB
                            </p>
                          </div>
                          {!cvPath && (
                            <Button type="button" variant="outline" size="sm">
                              Select File
                            </Button>
                          )}
                        </div>
                      </div>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-4 space-y-2">
                          <Progress value={uploadProgress} />
                          <p className="text-xs text-muted-foreground text-center">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Cover Letter (Optional)</h3>
                      <div className="border-2 border-dashed rounded-lg p-8">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <div className="space-y-1 text-center">
                            <p className="text-sm font-medium">
                              {coverLetterPath ? "Cover letter uploaded" : "Upload your cover letter"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, DOC, or DOCX up to 10MB
                            </p>
                          </div>
                          <Button type="button" variant="outline" size="sm">
                            Select File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Configuration */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Interview Configuration</CardTitle>
                  <CardDescription>
                    Configure your interview settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="interviewType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interview Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="hr" />
                              </FormControl>
                              <FormLabel className="font-normal">HR</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="technical" />
                              </FormControl>
                              <FormLabel className="font-normal">Technical</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="manager" />
                              </FormControl>
                              <FormLabel className="font-normal">Manager</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 minute</SelectItem>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interview Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 4: Summary */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Interview Summary</CardTitle>
                  <CardDescription>
                    Review your interview settings before starting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
                        <p className="mt-1">{jobInfo?.title || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                        <p className="mt-1">{jobInfo?.company || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Interview Type</h3>
                        <p className="mt-1 capitalize">{form.getValues("interviewType")}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                        <p className="mt-1">{form.getValues("duration")} minutes</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Difficulty</h3>
                        <p className="mt-1 capitalize">{form.getValues("difficulty")}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
                        <p className="mt-1">{form.getValues("language")}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Documents</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FileUp className="h-4 w-4" />
                          <span>CV: {cvPath ? "Uploaded" : "Not uploaded"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileUp className="h-4 w-4" />
                          <span>Cover Letter: {coverLetterPath ? "Uploaded" : "Not uploaded"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === 1 && !jobInfo}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={isSubmitting || !jobInfo}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Interview...
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}