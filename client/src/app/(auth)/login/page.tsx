"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";

import Spinner from "@/components/spinner";

import { loginSchema } from "@/lib/zod";

import { useLogin } from "@/hooks/auth/use-login";

const LoginPage = () => {
  const { theme } = useTheme();

  const { mutate: login, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    login(values);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <Image
          src={theme === "light" ? "/images/logo.svg" : "/images/logo-dark.svg"}
          alt="Logo"
          width={40}
          height={40}
        />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Welcome to Movpla
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Login with your email or social account to continue
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-4"
            size="lg"
          >
            {isPending ? <Spinner /> : "Continue"}
          </Button>
        </form>
      </Form>

      {/* Separator */}
      <div className="flex items-center gap-2">
        <div className="flex-grow h-px bg-neutral-300 dark:bg-neutral-700"></div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          OR
        </span>
        <div className="flex-grow h-px bg-neutral-300 dark:bg-neutral-700"></div>
      </div>

      {/* Social Login */}
      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full flex items-center justify-center dark:bg-neutral-50 dark:text-black dark:hover:opacity-80"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="mr-2" size={20} />
          Continue with Google
        </Button>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-neutral-500 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-neutral-800 dark:text-neutral-200 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
