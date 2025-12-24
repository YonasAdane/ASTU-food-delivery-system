"use client"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { getErrorMessage } from "@/lib/get-error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
// import { forgotPassword } from "@/action/auth"
import { useUserStore } from "@/hooks/use-profile"
import { User } from "@/types/user"

// Schema for login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
type LoginInputType = z.infer<typeof loginSchema>

// Schema for forgot password
const emailSchema = z.object({
  email: z.string().email()
})
type ForgotPasswordInputType = z.infer<typeof emailSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [currentView, setCurrentView] = useState<"login" | "forgot">("login")

  // Login form
  const loginForm = useForm<LoginInputType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  // Forgot password form
  const forgotPasswordForm = useForm<ForgotPasswordInputType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    },
  })

  // Handle login submission
async function onLoginSubmit(data: LoginInputType) {
  const { setUser } = useUserStore.getState();

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json() as {
      success: boolean;
      user: User;
      message?: string;
    };
		console.log({result});
    if (!res.ok) {
      console.log(result);
      toast.error(typeof result.message === "string" ? result.message : "Invalid credentials.");
      return;
    }

    // Store user data in Zustand store
    setUser(result.user);

    toast.success("Redirecting you to your dashboard!");
    router.refresh();
    setTimeout(() => router.push("/dashboard"), 1000);
  } catch (error) {
    toast.error(getErrorMessage(error) ?? "Please try again later!");
  }
}

  // Handle forgot password submission
  async function onForgotPasswordSubmit(data: ForgotPasswordInputType) {
    if (typeof data.email !== 'string') {
      toast("Email is not provided")
      return
    }
    
    try {
      // const response = await forgotPassword(data as { email: string });
      const response:any= {success: true, message: "Password reset link sent to your email."}
      if (response?.success) {
        toast.success(response.message)
        // Return to login view after successful submission
        setCurrentView("login")
        // Reset form
        forgotPasswordForm.reset({ email: "" })
      }
      
      if (response?.error) {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("We couldn't reset your password. Please try again!")
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex font-sans ">
      <div className="hidden lg:flex lg:w-1/2  relative overflow-hidden bg-cover backdrop-brightness-50 backdrop-sepia-50 bg-center" style={{ backgroundImage: "url(/newone_114209.jpg)" }}>
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          <Image className="absolute top-0 left-12 object-cover " src="/SAF-MAIN-LOGO.png" width={180} height={40} alt="logo"/>
          <div className="flex-1 flex flex-col justify-end-safe ">
            <h2 className="text-4xl mb-6 leading-tight text-gray-950">Effortlessly manage your network infrastructure and teams.</h2>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Copyright © 2025 Safaricom.</span>
            <span className="cursor-pointer hover:/90">Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
			<div className=" p-10 rounded-3xl">
        <div className="w-full  max-w-md space-y-8">
          <div className="lg:hidden relative text-center mb-8">
            <div className="rounded-lg flex items-center justify-center mx-auto">
              <Image className="object-cover h-20" src="/SAF-MAIN-LOGO.png" width={180} height={40} alt="logo"/>
            </div>
          </div>

          <div className="space-y-6 text-center">
            {currentView === "forgot" && (
              <Button
                variant="ghost"
                onClick={() => setCurrentView("login")}
                className="absolute left-8 top-8 p-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-3xl text-foreground">
              {currentView === "login" ? "Welcome Back" : "Forgot Password"}
            </h2>
            <p className="text-muted-foreground">
              {currentView === "login"
                ? "Enter your email and password code to access your account."
                : "No worries! Enter your email address below, and we will send you a link to reset your password."}
            </p>
          </div>

          {/* Login Form */}
          {currentView === "login" && (
            <Form {...loginForm}>                
              <form className="space-y-8 " onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="me@example.com"
                          {...field}
                          className="h-12 border-accent shadow-none rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password">Password Code</Label>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password code"
                            {...field}
                            className="h-12 pr-10 border-accent shadow-none rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm hover:text-opacity-80 cursor-pointer"
                    onClick={() => setCurrentView("forgot")}
                  >
                    Forgot Your Password Code?
                  </Button>
                </div>

                <Button 
                  disabled={loginForm.formState.isSubmitting} 
                  type="submit" 
                  className="w-full h-12 text-sm font-medium hover:opacity-90 rounded-lg shadow-none"
                >
                  {loginForm.formState.isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                  Log In
                </Button>
              </form>
            </Form>
          )}

          {/* Forgot Password Form */}
          {currentView === "forgot" && (
            <Form {...forgotPasswordForm}>
              <form 
                className="space-y-4" 
                onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
              >
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="forgot-email">Email</Label>
                        <Link 
                          className="text-sm text-right underline-offset-2 hover:underline cursor-pointer" 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentView("login");
                          }}
                        >
                          Remembered your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                          className={`h-12 border-accent shadow-none rounded-lg ${forgotPasswordForm.formState.errors.email && 'border-destructive bg-destructive/30'}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={forgotPasswordForm.formState.isSubmitting} 
                  className={`w-full h-12 text-sm font-medium hover:opacity-90 rounded-lg shadow-none ${forgotPasswordForm.formState.isSubmitting && "cursor-not-allowed bg-muted-foreground/100"}`}
                  variant="default"
                >
                  {forgotPasswordForm.formState.isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                  Submit
                </Button>
              </form>
            </Form>
          )}

          {currentView === "forgot" && (
            <div className="text-center text-sm text-muted-foreground">
              Remember Your Password Code?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                onClick={() => setCurrentView("login")}
              >
                Back to Login.
              </Button>
            </div>
          )}
					
        </div>

			</div>
      </div>
    </div>
  )
}