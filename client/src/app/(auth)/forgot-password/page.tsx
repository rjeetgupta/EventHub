"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react"

const forgotSchema = z.object({
  email: z.email("Enter the campus email associated with your account."),
})

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(data: z.infer<typeof forgotSchema>) {
    setIsLoading(true)
    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Reset link sent to:", data.email)
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Reset Password
          </CardTitle>
          <CardDescription>
            Enter your email to receive a reset link
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isSubmitted ? (
            <Alert className="bg-primary/5 border-primary/20">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                If an account exists for <strong>{form.getValues("email")}</strong>,
                you will receive a password reset link shortly.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="student@university.edu"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          <p className="text-xs text-center text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
