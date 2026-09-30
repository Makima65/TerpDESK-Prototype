"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
 email: z.string().email({ message: "Please enter a valid email address" }),
 password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
 const {
 register,
 handleSubmit,
 formState: { errors, isSubmitting },
 } = useForm<LoginFormValues>({
 resolver: zodResolver(loginSchema),
 defaultValues: {
 email: "",
 password: "",
 },
 });

 const onSubmit = async (data: LoginFormValues) => {
 // In a production app, handle authentication here
 console.log("Login data:", data);
 await new Promise((resolve) => setTimeout(resolve, 1000));
 };

 return (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
 <div className="space-y-1">
 <label
 htmlFor="email"
 className="block text-xs lg:text-sm text-[var(--sage)]"
 >
 Email
 </label>
 <input
 id="email"
 type="email"
 disabled={isSubmitting}
 {...register("email")}
 className="w-full rounded-full bg-neutral-100 px-4 py-2.5 text-sm outline-none transition-colors focus:bg-neutral-200 focus:ring-2 focus:ring-[#0B3B32]/20"
 />
 {errors.email && (
 <p className="text-xs text-red-500">{errors.email.message}</p>
 )}
 </div>

 <div className="space-y-1">
 <label
 htmlFor="password"
 className="block text-xs lg:text-sm text-[var(--sage)]"
 >
 Password
 </label>
 <input
 id="password"
 type="password"
 disabled={isSubmitting}
 {...register("password")}
 className="w-full rounded-full bg-neutral-100 px-4 py-2.5 text-sm outline-none transition-colors focus:bg-neutral-200 focus:ring-2 focus:ring-[#0B3B32]/20"
 />
 {errors.password && (
 <p className="text-xs text-red-500">{errors.password.message}</p>
 )}
 </div>

 <div className="pt-2">
 <button
 type="submit"
 disabled={isSubmitting}
 className="rounded-full bg-[var(--forest)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0B3B32]/50 disabled:opacity-50"
 >
 {isSubmitting ? "Signing in..." : "Sign in"}
 </button>
 </div>
 </form>
 );
}
