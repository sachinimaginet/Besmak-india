"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate, getNewCaptcha } from "@/app/lib/actions";
import { Mail, Lock, LogIn, Hash, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CaptchaData } from "@/lib/captcha";
import { useEffect, useState } from "react";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/30"
      aria-disabled={pending}
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        <LogIn
          className="h-5 w-5 text-primary-foreground/60 group-hover:text-primary-foreground/80"
          aria-hidden="true"
        />
      </span>
      {pending ? "Authenticating..." : "Sign In to Admin"}
    </button>
  );
}

export default function LoginForm({
  initialCaptcha,
}: {
  initialCaptcha: CaptchaData;
}) {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const [captcha, setCaptcha] = useState(initialCaptcha);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh captcha on error
  useEffect(() => {
    if (errorMessage) {
      handleRefreshCaptcha();
    }
  }, [errorMessage]);

  const handleRefreshCaptcha = async () => {
    setIsRefreshing(true);
    try {
      const newCaptcha = await getNewCaptcha();
      setCaptcha(newCaptcha);
    } catch (error) {
      console.error("Failed to refresh captcha:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <form
      className="mt-8 space-y-6 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
      action={dispatch}
    >
      <input type="hidden" name="captchaToken" value={captcha.token} />

      <div className="space-y-4">
        <div>
          <label
            htmlFor="email-address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-900 sm:text-sm bg-gray-50/50"
              placeholder="admin@example.com"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-900 sm:text-sm bg-gray-50/50"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Captcha Field */}
        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="captchaAnswer"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Hash className="h-4 w-4 mr-2 text-primary" />
              Security Check: What is{" "}
              <span className="font-bold text-primary ml-1">
                {captcha.question}
              </span>
              ?
            </label>
            <button
              type="button"
              onClick={handleRefreshCaptcha}
              disabled={isRefreshing}
              className="text-primary hover:text-primary/80 disabled:text-gray-400 transition-colors p-1"
              title="Refresh Captcha"
            >
              <RefreshCcw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <div className="relative">
            <input
              id="captchaAnswer"
              name="captchaAnswer"
              type="text"
              required
              className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 sm:text-sm bg-white"
              placeholder="Enter result"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded-md transition-all duration-200"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-600"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <div className="min-h-5">
        {errorMessage && (
          <div className="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg flex items-center border border-red-100 animate-shake">
            <svg
              className="h-4 w-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errorMessage}
          </div>
        )}
      </div>

      <div>
        <LoginButton />
      </div>
    </form>
  );
}
