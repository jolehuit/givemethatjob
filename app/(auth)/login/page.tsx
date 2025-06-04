"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Briefcase, Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  import { Sparkles, Loader2 } from "lucide-react";
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      toast.success("Successfully signed in!");
      router.push(redirect);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex flex-col items-center space-y-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="font-bold text-2xl">GiveMeThatJob</span>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
              >
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
              </motion.div>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10"
              >
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
              </motion.div>
            )}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              type="submit" 
              className="w-full relative overflow-hidden z-10" 
              disabled={isLoading}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{
                  x: ["-200%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
                style={{ pointerEvents: "none" }}
              />
              <span className="relative z-10">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
            </Button>
          </motion.div>
        </form>
      </Form>

      <motion.div 
        className="text-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Sign up
        </Link>
      </motion.div>
    </div>
  );
}