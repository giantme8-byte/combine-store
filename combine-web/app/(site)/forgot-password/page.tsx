"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Mail,
} from "lucide-react";


// ============================================================
// FORGOT PASSWORD PAGE
// ============================================================

export default function ForgotPasswordPage() {

  const router =
    useRouter();


  // ==========================================================
  // STATE
  // ==========================================================

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);


  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();


    if (loading) {
      return;
    }


    setError("");


    if (!email.trim()) {

      setError(
        "Please enter your email address."
      );

      return;
    }


    /*
     * API will be connected in the next step.
     *
     * For now this page only handles
     * the form interface.
     */

    try {

      setLoading(true);


      const res =
        await fetch(
          "/api/auth/forgot-password",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email:
                email.trim(),
            }),
          }
        );


      const data =
        await res.json();


      if (!res.ok) {

        setError(
          data.message ??
            "Something went wrong. Please try again."
        );

        return;
      }


      setSuccess(true);

    } catch (error) {

      console.error(
        "Forgot password request failed:",
        error
      );


      setError(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // SUCCESS STATE
  // ==========================================================

  if (success) {

    return (

      <main
        className="
          mx-auto
          flex
          min-h-screen
          max-w-[1440px]
          items-center
          justify-center
          px-8
          py-24
          lg:px-12
        "
      >

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

          {/* ==================================================
              ICON
          ================================================== */}

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-neutral-100
              text-[#C8A96A]
            "
          >

            <Mail
              size={26}
              strokeWidth={1.5}
            />

          </div>


          {/* ==================================================
              HEADER
          ================================================== */}

          <div
            className="
              mt-8
              text-center
            "
          >

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
              Check Your Email
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
              If an account exists for this
              email address, we&apos;ve sent you
              a link to reset your password.
            </p>


            <p
              className="
                mx-auto
                mt-5
                max-w-md
                text-sm
                leading-6
                text-neutral-400
              "
            >
              Please check your inbox and
              spam folder. The reset link will
              expire after a limited time.
            </p>

          </div>


          {/* ==================================================
              BACK TO LOGIN
          ================================================== */}

          <Link
            href="/login"
            className="
              mt-12
              inline-flex
              w-full
              items-center
              justify-center
              gap-3
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
            "
          >

            <ArrowLeft
              size={16}
              strokeWidth={1.8}
            />

            Back to Sign In

          </Link>

        </div>

      </main>

    );

  }


  // ==========================================================
  // FORM
  // ==========================================================

  return (

    <main
      className="
        mx-auto
        flex
        min-h-screen
        max-w-[1440px]
        items-center
        justify-center
        px-8
        py-24
        lg:px-12
      "
    >

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

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div
          className="
            text-center
          "
        >

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
            Forgot Password
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
            Enter the email address associated
            with your COMBINE account and
            we&apos;ll send you a secure link
            to reset your password.
          </p>

        </div>


        {/* ====================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            mt-14
            space-y-8
          "
        >

          {/* ==================================================
              EMAIL
          ================================================== */}

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
                setEmail(
                  e.target.value
                )
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


          {/* ==================================================
              ERROR
          ================================================== */}

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
                leading-6
                text-red-600
              "
            >
              {error}
            </div>

          )}


          {/* ==================================================
              SUBMIT
          ================================================== */}

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
              ? "Sending Reset Link..."
              : "Send Reset Link"}

          </button>

        </form>


        {/* ====================================================
            BACK TO LOGIN
        ==================================================== */}

        <div
          className="
            mt-12
            border-t
            border-neutral-200
            pt-10
            text-center
          "
        >

          <Link
            href="/login"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              uppercase
              tracking-[0.3em]
              text-[#C8A96A]
              transition
              hover:opacity-70
            "
          >

            <ArrowLeft
              size={15}
              strokeWidth={1.8}
            />

            Back to Sign In

          </Link>

        </div>

      </div>

    </main>

  );

}