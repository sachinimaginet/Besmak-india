import { generateCaptcha } from "@/lib/captcha";
import LoginForm from "./LoginForm";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const captcha = generateCaptcha();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center">
            <Link href="/" className="inline-block duration-300">
              <Image
                src="/images/Besmak-Logo.png"
                alt="Besmak Logo"
                width={100}
                height={100}
                className="h-auto w-auto object-contain"
                priority
              />
            </Link>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure access for Besmak India administrators
          </p>
        </div>

        <LoginForm initialCaptcha={captcha} />

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Secure Admin Access Powered by NextAuth
          </p>
        </div>
      </div>
    </div>
  );
}
