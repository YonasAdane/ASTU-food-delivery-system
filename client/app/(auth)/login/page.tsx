"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { getErrorMessage } from "@/lib/get-error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useUserStore } from "@/hooks/use-profile"
import { User } from "@/types/user"

/* -------------------- Schemas -------------------- */

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type LoginInputType = z.infer<typeof loginSchema>

const emailSchema = z.object({
  email: z.string().email(),
})

type ForgotPasswordInputType = z.infer<typeof emailSchema>

/* -------------------- Page -------------------- */

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [currentView, setCurrentView] = useState<"login" | "forgot">("login")

  const loginForm = useForm<LoginInputType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const forgotPasswordForm = useForm<ForgotPasswordInputType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  /* -------------------- Login Submit -------------------- */
  async function onLoginSubmit(data: LoginInputType) {
    const { setUser } = useUserStore.getState()

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = (await res.json()) as {
        success: boolean
        user: User
        message?: string
      }

      if (!res.ok) {
        toast.error(result.message ?? "Invalid credentials")
        return
      }

      setUser(result.user)
      router.refresh()
      const redirectMap: Record<string, string> = {
        customer: '/customer',
        restaurant: '/restaurant',
        driver: '/driver',
        admin: '/admin',
      };
      toast.success("Redirecting you to your dashboard!")
      const redirectTo = redirectMap[result.user.role];
      console.log(result.user)
      if (redirectTo) {
        console.log(redirectTo)
        router.push(redirectTo)
        // return NextResponse.redirect(new URL(redirectTo, req.nextUrl.origin));
        // setTimeout(() => router.push(redirectTo), 1000)
      }
    } catch (error) {
      console.log(error instanceof Error ? error.message : getErrorMessage(error))
      toast.error(error instanceof Error ? error.message : getErrorMessage(error) ?? "Please try again later!")
    }
  }

  /* -------------------- Forgot Password -------------------- */
  /* -------------------- Forgot Password -------------------- */
  async function onForgotPasswordSubmit(data: ForgotPasswordInputType) {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok) {
        toast.success(result.message || "Password reset link sent to your email.");
        setCurrentView("login")
        forgotPasswordForm.reset()
      } else {
        toast.error(result.message || "Something went wrong. Please try again!")
      }
    } catch (error) {
      toast.error(getErrorMessage(error) ?? "Please try again later!")
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* -------------------- LEFT IMAGE -------------------- */}
      <div
        className="hidden lg:flex relative bg-cover bg-center"
        style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuDylVecAXoGcMjidV1NPfkIyA_VdvnTeMQAOkaWzyrzRhQf3EAi61Cc8xyYXLSZ8q6KpkFE6K75iBo3zMt1EoB5bvRLKbNzpK0WGMdN10FwQEpwERkIUVEmVEKMllZ8KTpRM08BvEZsFNXVl6c0CR92UcaYSnihi56CbfQzKoZ5154fRBS0a4bFDZR5NLs17de6qaCHKvheFeewtTGSYbVo0nO4OOpwKG7D4vhbgELn6UHxjNBfIuygm-txQMSQG-aOIEP7WSlSFPE)" }}
      >
        <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
          {/* <!-- Top Brand Mark --> */}
          <div className="flex items-center gap-3">
            {/* <div
              className="flex items-center justify-center size-10 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary">
              <span className="material-symbols-outlined text-2xl">lunch_dining</span>
            </div> */}
            <span className="text-white font-extrabold text-xl tracking-wide">ASTU Food</span>
          </div>
          {/* <!-- Bottom Quote/Context --> */}
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Fresh food, delivered campus-wide.
            </h2>
            <p className="text-gray-300 text-lg">
              Experience the fastest delivery service designed specifically for
              ASTU students and staff.
            </p>
            <div className="mt-8 flex gap-2">
              <div className="h-1.5 w-8 rounded-full bg-primary"></div>
              <div className="h-1.5 w-2 rounded-full bg-white/20"></div>
              <div className="h-1.5 w-2 rounded-full bg-white/20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- RIGHT FORM -------------------- */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-card p-10 rounded-3xl shadow-lg space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center">
            <Image
              src="/SAF-MAIN-LOGO.png"
              width={160}
              height={40}
              alt="logo"
            />
          </div>

          {/* Header */}
          <div className="text-center space-y-2 relative">
            {currentView === "forgot" && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-0"
                onClick={() => setCurrentView("login")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            <h1 className="text-3xl font-bold">
              {currentView === "login" ? "Welcome Back" : "Forgot Password"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {currentView === "login"
                ? "Enter your credentials to access your account"
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {/* -------------------- LOGIN FORM -------------------- */}
          {currentView === "login" && (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-6"
              >
                {/* Email */}
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="me@example.com"
                            className="pl-11 h-12 rounded-xl"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="pl-11 pr-11 h-12 rounded-xl"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3.5 text-muted-foreground hover:text-primary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full h-12 rounded-xl"
                >
                  {loginForm.formState.isSubmitting && (
                    <Spinner className="mr-2 h-4 w-4" />
                  )}
                  Log In
                </Button>

                <Button
                  type="button"
                  variant="link"
                  className="w-full text-sm"
                  onClick={() => setCurrentView("forgot")}
                >
                  Forgot your password code?
                </Button>
              </form>
            </Form>
          )}

          {/* -------------------- FORGOT FORM -------------------- */}
          {currentView === "forgot" && (
            <Form {...forgotPasswordForm}>
              <form
                onSubmit={forgotPasswordForm.handleSubmit(
                  onForgotPasswordSubmit
                )}
                className="space-y-6"
              >
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className="h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={forgotPasswordForm.formState.isSubmitting}
                  className="w-full h-12 rounded-xl"
                >
                  {forgotPasswordForm.formState.isSubmitting && (
                    <Spinner className="mr-2 h-4 w-4" />
                  )}
                  Send Reset Link
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  )
}
