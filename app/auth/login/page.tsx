"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import apiService from "@/service/api";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/api-hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm2 } from "@/components/auth/SignInForm2";
import { FieldDescription } from "@/components/ui/field";

type Inputs = {
  login: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [view, setView] = useState<"signin" | "forgot">("signin");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  // --- API Call Logic using React Query ---
  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (data: Inputs) => apiService.post("/auth/login", data),
    onSuccess: (response) => {
      const authData = response.data; // The { user, accessToken } payload

      login(authData);

      addToast({
        title: "Success",
        description: "Login successful!",
        color: "success",
      });

      // Redirect based on user role
      if (authData.user.role === "STUDENT") {
        router.push("/learn");
      } else {
        router.push("/learn/admin");
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      addToast({
        title: "Login Failed",
        description:
          error.response?.data?.message ||
          "Invalid credentials. Please try again.",
        color: "danger",
      });
    },
  });

  // This handler is called by react-hook-form after validation
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    loginMutation(data);
  };

  return (
    <div className={"flex flex-col gap-6 w-full"}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <LoginForm2
            register={register}
            onSubmit={handleSubmit(onSubmit)}
            errors={errors}
            isLoading={isPending}
            view={view}
            onViewChange={setView}
          />
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://static.vecteezy.com/system/resources/previews/056/583/330/non_2x/illustration-of-a-woman-taking-an-online-exam-on-a-laptop-vector.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
