"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setError("");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Login failed.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-8 py-24 lg:px-12">

      <div
        className="
          w-full
          max-w-xl
          rounded-[40px]
          border
          border-neutral-200
          bg-white
          p-12
          shadow-[0_30px_80px_rgba(0,0,0,.05)]
        "
      >

        <div className="text-center">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.55em]
              text-neutral-400
            "
          >
            ACCOUNT
          </p>

          <h1
            className="
              mt-6
              text-5xl
              font-extralight
              tracking-[-0.04em]
              text-neutral-900
            "
          >
            Sign In
          </h1>

          <div
            className="
              mx-auto
              mt-8
              h-px
              w-20
              bg-gradient-to-r
              from-transparent
              via-[#C8A96A]
              to-transparent
            "
          />

          <p
            className="
              mx-auto
              mt-8
              max-w-md
              text-lg
              leading-8
              text-neutral-500
            "
          >
            Welcome back to COMBINE.
            Sign in to access your wishlist,
            enquiry history and account.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-14 space-y-8"
        >

          <div>

            <label
              htmlFor="email"
              className="
                text-[11px]
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="
                mt-3
                w-full
                rounded-2xl
                border
                border-neutral-200
                px-6
                py-4
                text-neutral-900
                outline-none
                transition-all
                duration-300
                focus:border-[#C8A96A]
                focus:ring-4
                focus:ring-[#C8A96A]/10
              "
            />

          </div>

          <div>

            <div className="flex items-center justify-between">

              <label
                htmlFor="password"
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.35em]
                  text-neutral-400
                "
              >
                Password
              </label>

              <Link
                href="#"
                className="
                  text-xs
                  text-neutral-500
                  transition
                  hover:text-[#C8A96A]
                "
              >
                Forgot Password?
              </Link>

            </div>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              className="
                mt-3
                w-full
                rounded-2xl
                border
                border-neutral-200
                px-6
                py-4
                text-neutral-900
                outline-none
                transition-all
                duration-300
                focus:border-[#C8A96A]
                focus:ring-4
                focus:ring-[#C8A96A]/10
              "
            />

          </div>

          {error && (
            <div
              className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-5
                py-4
                text-sm
                text-red-600
              "
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex
              w-full
              items-center
              justify-center
              rounded-full
              bg-black
              px-8
              py-4
              text-[11px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-white
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#C8A96A]
              hover:shadow-xl
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>

        <div
          className="
            mt-12
            border-t
            border-neutral-200
            pt-10
            text-center
          "
        >

          <p className="text-neutral-500">
            Don't have an account?
          </p>

          <Link
            href="/register"
            className="
              mt-4
              inline-flex
              text-sm
              uppercase
              tracking-[0.3em]
              text-[#C8A96A]
              transition
              hover:opacity-70
            "
          >
            Create Account
          </Link>

        </div>

      </div>

    </main>
  );
}