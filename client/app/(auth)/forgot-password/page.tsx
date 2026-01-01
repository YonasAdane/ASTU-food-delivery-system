"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, LockKeyhole, Timer, Utensils } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
// import { otpSchema, OTPFormValues } from "./schema";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import * as z from "zod";
import { toast } from "sonner"; // Or your preferred toast library
import Link from "next/link";

export const otpSchema = z.object({
  pin: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
});

export type OTPFormValues = z.infer<typeof otpSchema>;



export default function OTPVerification() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(179);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { pin: "" },
  });

  // Countdown logic
  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  async function onSubmit(data: OTPFormValues) {
    setIsLoading(true);
    try {
      // API Integration Point
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Invalid OTP");

      toast.success("Verification successful!");
      // router.push("/dashboard");
    } catch (error) {
      toast.error("The code you entered is incorrect.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
			
      <main className="flex-1 flex w-full relative overflow-hidden items-center justify-center p-6">
        {/* Decorative elements using Shadcn Primary variable */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-[20%] -right-[10%] size-[600px] bg-primary rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-[1000px] bg-card rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-border">
          
          {/* Left Column: Image with Primary Overlay */}
          <div className="hidden md:flex md:w-5/12 bg-muted relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" 
              alt="Healthy food"
              className="absolute inset-0 object-cover h-full w-full"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase">Secure</span>
                <span className="text-white/80 text-xs font-medium">Step 2 of 2</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">Almost there!</h3>
              <p className="text-white/70 text-sm">Verify your identity to start ordering.</p>
            </div>
          </div>

          {/* Right Column: Verification Form */}
          <div className="w-full md:w-7/12 p-8 lg:p-12 flex flex-col justify-center relative">
            <Button 
              variant="ghost" 
              className="absolute top-8 left-8 text-muted-foreground hover:text-primary"
            >
							<Link className="flex" href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
							</Link>
            </Button>

            <div className="max-w-[400px] mx-auto w-full">
              <div className="mb-6 size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <LockKeyhole className="size-7" />
              </div>

              <h1 className="text-3xl font-extrabold mb-3 tracking-tight">OTP Verification</h1>
              <p className="text-muted-foreground mb-8">
                We've sent a code to <span className="font-semibold text-foreground">user@astu.edu.et</span>
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP 
                            maxLength={4} 
                            {...field}
                            className="flex justify-between"
                          >
                            <InputOTPGroup className="gap-3 sm:gap-4">
                              <InputOTPSlot className="h-16 w-14 sm:w-16 text-2xl rounded-xl border-input bg-background focus:border-primary" index={0} />
                              <InputOTPSlot className="h-16 w-14 sm:w-16 text-2xl rounded-xl border-input bg-background focus:border-primary" index={1} />
                              <InputOTPSlot className="h-16 w-14 sm:w-16 text-2xl rounded-xl border-input bg-background focus:border-primary" index={2} />
                              <InputOTPSlot className="h-16 w-14 sm:w-16 text-2xl rounded-xl border-input bg-background focus:border-primary" index={3} />
                              <InputOTPSlot className="h-16 w-14 sm:w-16 text-2xl rounded-xl border-input bg-background focus:border-primary" index={4} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="size-4 text-primary" />
                    <span>Expires in <span className="font-bold text-foreground">{formatTime(timeLeft)}</span></span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-bold transition-all shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify & Proceed"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code? 
                  <button 
                    type="button"
                    onClick={() => setTimeLeft(179)}
                    className="font-bold text-primary hover:underline ml-1"
                  >
                    Resend Code
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/40">
        <p>© 2024 ASTU Food Delivery System. Capstone Project.</p>
      </footer>
    </div>
  );
}