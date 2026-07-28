"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setError("");

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/dashboard");
        router.refresh();
        return;
      }

      setError(data.message || "Login failed.");

    } catch (error) {
      console.error("Login failed:", error);

      setError(
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">

        <div className="mb-10 text-center">
          <Link
            href="/"
            className="inline-block text-4xl font-extralight tracking-[0.35em] transition-opacity hover:opacity-70"
          >
            COMBINE
          </Link>

          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Administrator Portal
          </p>
        </div>


        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-[0.2em] text-neutral-500"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-2xl border border-neutral-200 px-5 py-4 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
            />
          </div>


          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-[0.2em] text-neutral-500"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-2xl border border-neutral-200 px-5 py-4 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
            />
          </div>


          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>
    </main>
  );
}