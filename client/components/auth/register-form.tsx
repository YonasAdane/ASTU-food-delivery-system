"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { registerCustomer } from "@/actions/auth"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Lock, Mail, Phone, User } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

const registerSchema = z
  .object({
    phone: z.string().min(3, "Phone Number is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: "You must accept the terms",
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

type RegisterInput = z.infer<typeof registerSchema>
export function RegisterForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  function onSubmit(values: RegisterInput) {
    startTransition(async () => {
      const res = await registerCustomer(values)

      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      form.reset()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input {...field} className="pl-11 h-12" placeholder="student@astu.edu" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Full Name */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input {...field} className="pl-11 h-12" placeholder="+251912345678" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input {...field} type="password" className="pl-11 h-12" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input {...field} type="password" className="pl-11 h-12" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Terms */}
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-xs leading-snug">
                I agree to the Terms of Service and Privacy Policy
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full h-12">
          {isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  )
}
