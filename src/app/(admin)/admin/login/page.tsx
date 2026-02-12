"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/app/lib/actions";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      aria-disabled={pending}
    >
      {pending ? "Logging in..." : "Login"}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form action={dispatch} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border p-2 rounded"
            placeholder="admin@example.com"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full border p-2 rounded"
            placeholder="********"
          />
        </div>
        <div className="text-red-500 text-sm h-4">
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        <LoginButton />
      </form>
    </div>
  );
}
