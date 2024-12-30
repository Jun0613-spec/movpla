"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import Spinner from "@/components/spinner";

import { registerSchema } from "@/lib/zod";

import { useRegister } from "@/hooks/auth/use-register";
import { useLogin } from "@/hooks/auth/use-login";

const RegisterPage = () => {
  const { theme } = useTheme();

  const { mutate: register, isPending } = useRegister();
  const { mutate: login } = useLogin();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    register(values, {
      onSuccess: () => {
        login({ email: values.email, password: values.password });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <Image
          src={theme === "light" ? "/images/logo.svg" : "/images/logo-dark.svg"}
          alt="Logo"
          className="text-black dark:text-white"
          width={40}
          height={40}
        />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Welcome to Movpla
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Register with your email to continue
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="firstName"
                    placeholder="Enter your first name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="lastName"
                    placeholder="Enter your last name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <Separator className="dark:bg-neutral-700" />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-4"
            size="lg"
          >
            {isPending ? <Spinner /> : "Register"}
          </Button>
        </form>
      </Form>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-neutral-500 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-neutral-800 dark:text-neutral-200 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
