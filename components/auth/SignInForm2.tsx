"use client";

import { useState } from "react";
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Your utility function

// Shadcn/ui component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

type Inputs = {
  login: string;
  password: string;
};

interface LoginFormProps2 {
  register: UseFormRegister<Inputs>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<Inputs>;
  isLoading: boolean;
  view: "signin" | "forgot";
  onViewChange: (view: "signin" | "forgot") => void;
}

export const LoginForm2 = ({
  register,
  onSubmit,
  errors,
  isLoading,
  view,
  onViewChange,
}: LoginFormProps2) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    // Use a standard div or Card for the wrapper
    <div className=" w-full max-w-md">
      {view === "signin" ? (
        <form className="flex flex-col gap-6 p-8" onSubmit={onSubmit}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center mb-4">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
              <p className="text-sm text-muted-foreground text-balance">
                Enter your email and password below.
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={cn(
                    "pl-9",
                    errors.login &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                  {...register("login", { required: "login is required" })}
                />
              </div>
              {errors.login && (
                <p className="text-xs text-destructive mt-1">
                  {errors.login.message}
                </p>
              )}
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => onViewChange("forgot")}
                  className="ml-auto h-auto p-0 text-sm"
                >
                  Forgot Password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={cn(
                    "pl-9 pr-10",
                    errors.password &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 px-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </Field>
            <Field>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </Field>
            {/* <FieldDescription className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="underline underline-offset-4 font-medium">
                Sign up
              </Link>
            </FieldDescription> */}
          </FieldGroup>
        </form>
      ) : (
        // --- Forgot Password View (Using shadcn components) ---
        <div className="p-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange("signin")}
            className="mb-4 -ml-2 h-auto p-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
          </Button>
          <form className="flex flex-col gap-6">
            <FieldGroup>
              <div className="flex flex-col gap-1 mb-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  Reset Your Password
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we'll send a reset link.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                  />
                </div>
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      )}
    </div>
  );
};
