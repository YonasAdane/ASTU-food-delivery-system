"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getErrorMessage } from "@/lib/get-error-message";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`, {
          method: "GET",
        });
				console.log(`http://localhost:5000/api/auth/verify-email/${token}`)
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been successfully verified! You can now log in.");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link might be expired or invalid.");
        }
      } catch (error) {
        setStatus("error");
				console.log(error);
        setMessage(getErrorMessage(error)||"Something went wrong. Please try again later.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-lg p-8 text-center space-y-6">
        
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="text-muted-foreground">Please wait while we verify your account.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild className="w-full mt-4">
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-destructive/10">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-destructive">Verification Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
