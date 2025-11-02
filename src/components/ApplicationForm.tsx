import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { ProgressIndicator } from "./ProgressIndicator";
import { PassCriteria } from "./PassCriteria";
import { API_BASE_URL } from "@/lib/config"; // <-- add this at the top


const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  category: z.string().min(1, "Please select a category"),
  experience: z.string().min(1, "Please select your experience level"),
  portfolio: z.string().url("Please enter a valid URL").min(1, "Portfolio link is required"),
  project1: z.string().max(100, "Maximum 100 characters").min(10, "Please describe your project"),
  project2: z.string().max(100, "Maximum 100 characters").min(10, "Please describe your project"),
  project3: z.string().max(100, "Maximum 100 characters").min(10, "Please describe your project"),
  hourlyRate: z.string().min(1, "Please select your hourly rate"),
  availability: z.string().min(1, "Please select your weekly availability"),
  whyOnSwift: z.string()
    .min(1, "This field is required")
    .max(500, "Maximum 500 characters")
    .refine((val) => val.trim().split(/\s+/).length >= 20, {
      message: "Please write at least 20 words"
    }),
});

type FormData = z.infer<typeof formSchema>;

export const ApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "rejected" | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const watchedFields = watch();

  // Auto-rejection logic
  const checkAutoRejection = (data: FormData): boolean => {
    // No portfolio
    if (!data.portfolio) return true;
    
    // Less than 3 years experience (0-2 years selected)
    if (data.experience === "0-2") return true;
    
    // Why OnSwift too short (less than 20 words)
    const wordCount = data.whyOnSwift.trim().split(/\s+/).length;
    if (wordCount < 20) return true;

    return false;
  };

  // Pass criteria checks
  const hasPortfolio = watchedFields.portfolio && !errors.portfolio;
  const hasExperience = watchedFields.experience && ["3-5", "6-10", "10+"].includes(watchedFields.experience);
  const whyWordCount = watchedFields.whyOnSwift ? watchedFields.whyOnSwift.trim().split(/\s+/).length : 0;
  const hasThoughtfulAnswer = whyWordCount >= 50;


const onSubmit = async (data: FormData) => {
  setIsSubmitting(true);
  setSubmitResult(null);
  // Transform camelCase to snake_case
  const payload = {
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    category: data.category,
    experience: data.experience,
    portfolio: data.portfolio,
    project1: data.project1,
    project2: data.project2,
    project3: data.project3,
    hourly_rate: data.hourlyRate,
    availability: data.availability,
    why_on_swift: data.whyOnSwift,
  };


  try {
    console.log("Backend URL:", API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/api/applications/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(payload);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Submission successful:", result);

    const isRejected = checkAutoRejection(data);
    setSubmitResult(isRejected ? "rejected" : "success");
  } catch (error) {
    console.error("Error submitting application:", error);
    setSubmitResult("rejected");
  } finally {
    setIsSubmitting(false);
  }
};


  if (submitResult === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-medium p-8 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Thanks for your interest</h2>
          <p className="text-muted-foreground mb-6">
            Unfortunately, your application doesn't meet our current criteria. You're welcome to reapply once you have more experience or a stronger portfolio.
          </p>
          <Button onClick={() => setSubmitResult(null)} variant="outline" className="w-full">
            Return to Form
          </Button>
        </div>
      </div>
    );
  }

  if (submitResult === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-medium p-8 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success animate-checkmark" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thanks for applying to OnSwift! We'll review your application within 48 hours and email you next steps.
          </p>
          <Button onClick={() => setSubmitResult(null)} variant="outline" className="w-full">
            Submit Another Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <ProgressIndicator currentStep={1} totalSteps={3} />
        
        <div className="bg-card rounded-2xl shadow-medium p-6 md:p-10 mt-8 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
              Join OnSwift
            </h1>
            <p className="text-muted-foreground text-lg">
              Apply to work with top-tier clients. We're looking for experienced freelancers who deliver exceptional quality.
            </p>
          </div>

          <PassCriteria
            hasPortfolio={hasPortfolio}
            hasExperience={hasExperience}
            hasThoughtfulAnswer={hasThoughtfulAnswer}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="John Doe"
                  className="mt-1.5"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className="mt-1.5"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1.5"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Category & Experience */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-xl font-semibold">Your Expertise</h2>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value, { shouldValidate: true })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select your primary category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logo-brand">Logo & Brand Identity Design</SelectItem>
                    <SelectItem value="social-graphics">Social Media Graphics</SelectItem>
                    <SelectItem value="copywriting">Copywriting (Sales Copy)</SelectItem>
                    <SelectItem value="content-writing">Content Writing (Blogs & SEO)</SelectItem>
                    <SelectItem value="social-management">Social Media Management</SelectItem>
                    <SelectItem value="virtual-assistant">Virtual Assistance</SelectItem>
                    <SelectItem value="digital-marketing">Digital Marketing (FB/IG Ads)</SelectItem>
                    <SelectItem value="frontend-dev">Frontend Development</SelectItem>
                    <SelectItem value="backend-dev">Backend Development</SelectItem>
                    <SelectItem value="video-editing">Video Editing</SelectItem>
                    <SelectItem value="ui-ux">Product Design (UI/UX)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="experience">Experience Level *</Label>
                <Select onValueChange={(value) => setValue("experience", value, { shouldValidate: true })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0–2 years</SelectItem>
                    <SelectItem value="3-5">3–5 years</SelectItem>
                    <SelectItem value="6-10">6–10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience && (
                  <p className="text-sm text-destructive mt-1">{errors.experience.message}</p>
                )}
              </div>
            </div>

            {/* Portfolio */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-xl font-semibold">Portfolio & Work</h2>
              
              <div>
                <Label htmlFor="portfolio">Portfolio Link *</Label>
                <Input
                  id="portfolio"
                  type="url"
                  {...register("portfolio")}
                  placeholder="https://behance.net/yourname or https://yourportfolio.com"
                  className="mt-1.5"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Behance, Dribbble, GitHub, LinkedIn, or personal website
                </p>
                {errors.portfolio && (
                  <p className="text-sm text-destructive mt-1">{errors.portfolio.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Your 3 Best Projects *</Label>
                <p className="text-sm text-muted-foreground -mt-1">
                  Describe each project in 1-2 sentences (max 100 characters each)
                </p>
                
                <div>
                  <Textarea
                    {...register("project1")}
                    placeholder="Project 1: Brief description of the project, your role, and impact..."
                    className="resize-none h-20"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.project1 && (
                      <p className="text-sm text-destructive">{errors.project1.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {watchedFields.project1?.length || 0}/100
                    </p>
                  </div>
                </div>

                <div>
                  <Textarea
                    {...register("project2")}
                    placeholder="Project 2: Brief description of the project, your role, and impact..."
                    className="resize-none h-20"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.project2 && (
                      <p className="text-sm text-destructive">{errors.project2.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {watchedFields.project2?.length || 0}/100
                    </p>
                  </div>
                </div>

                <div>
                  <Textarea
                    {...register("project3")}
                    placeholder="Project 3: Brief description of the project, your role, and impact..."
                    className="resize-none h-20"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.project3 && (
                      <p className="text-sm text-destructive">{errors.project3.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {watchedFields.project3?.length || 0}/100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rates & Availability */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-xl font-semibold">Rates & Availability</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
                  <Select onValueChange={(value) => setValue("hourlyRate", value, { shouldValidate: true })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select your rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15-30">$15–30</SelectItem>
                      <SelectItem value="30-50">$30–50</SelectItem>
                      <SelectItem value="50-80">$50–80</SelectItem>
                      <SelectItem value="80-120">$80–120</SelectItem>
                      <SelectItem value="120+">$120+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.hourlyRate && (
                    <p className="text-sm text-destructive mt-1">{errors.hourlyRate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="availability">Weekly Availability *</Label>
                  <Select onValueChange={(value) => setValue("availability", value, { shouldValidate: true })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Hours per week" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10-20">10–20 hours</SelectItem>
                      <SelectItem value="20-30">20–30 hours</SelectItem>
                      <SelectItem value="30-40">30–40 hours</SelectItem>
                      <SelectItem value="40+">40+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.availability && (
                    <p className="text-sm text-destructive mt-1">{errors.availability.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Why OnSwift */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-xl font-semibold">Final Question</h2>
              
              <div>
                <Label htmlFor="whyOnSwift">Why do you want to work with OnSwift clients? *</Label>
                <Textarea
                  id="whyOnSwift"
                  {...register("whyOnSwift")}
                  placeholder="Tell us what excites you about working with OnSwift clients and what value you'll bring..."
                  className="resize-none h-32 mt-1.5"
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  <div>
                    {errors.whyOnSwift && (
                      <p className="text-sm text-destructive">{errors.whyOnSwift.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Word count: {whyWordCount} (minimum 20 words, 50+ recommended)
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {watchedFields.whyOnSwift?.length || 0}/500
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
