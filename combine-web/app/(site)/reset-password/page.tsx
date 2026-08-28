"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import {
  Eye,
  EyeOff,
  ArrowLeft,
  LockKeyhole,
} from "lucide-react";


// ============================================================
// RESET PASSWORD PAGE
// ============================================================

export default function ResetPasswordPage() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();


  // ==========================================================
  // TOKEN
  // ==========================================================

  const token =
    searchParams.get("token") || "";


  // ==========================================================
  // STATE
  // ==========================================================

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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


    // ========================================================
    // TOKEN
    // ========================================================

    if (!token) {

      setError(
        "This password reset link is invalid or incomplete."
      );

      return;
    }


    // ========================================================
    // PASSWORD VALIDATION
    // ========================================================

    if (password.length < 8) {

      setError(
        "Password must be at least 8 characters."
      );

      return;
    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    // ========================================================
    // API
    // ========================================================

    try {

      setLoading(true);


      const res =
        await fetch(
          "/api/auth/reset-password",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              token,
              password,
            }),
          }
        );


      const data =
        await res.json();


      if (!res.ok) {

        setError(
          data.message ??
            "Unable to reset your password."
        );

        return;
      }


      setSuccess(true);

    } catch (error) {

      console.error(
        "Reset password request failed:",
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
  // SUCCESS
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

            <LockKeyhole
              size={26}
              strokeWidth={1.5}
            />

          </div>


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
              Password Updated
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
              Your COMBINE password has been
              successfully updated.
            </p>


            <p
              className="
                mx-auto
                mt-4
                max-w-md
                text-sm
                leading-6
                text-neutral-400
              "
            >
              You can now sign in with your
              new password.
            </p>

          </div>


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

            Sign In

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
            Create New Password
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
            Enter a new password for your
            COMBINE account.
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
              NEW PASSWORD
          ================================================== */}

          <div>

            <label
              htmlFor="password"
              className="
                text-[11px]
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
              New Password
            </label>


            <div
              className="
                relative
                mt-3
              "
            >

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your new password"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-neutral-200
                  px-6
                  py-4
                  pr-14
                  text-neutral-900
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[#C8A96A]
                  focus:ring-4
                  focus:ring-[#C8A96A]/10
                "
              />


              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-neutral-400
                  transition-colors
                  hover:text-[#C8A96A]
                "
              >

                {showPassword ? (
                  <EyeOff
                    size={20}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Eye
                    size={20}
                    strokeWidth={1.8}
                  />
                )}

              </button>

            </div>


            <p
              className="
                mt-3
                text-xs
                text-neutral-400
              "
            >
              Use at least 8 characters.
            </p>

          </div>


          {/* ==================================================
              CONFIRM PASSWORD
          ================================================== */}

          <div>

            <label
              htmlFor="confirmPassword"
              className="
                text-[11px]
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
              Confirm Password
            </label>


            <div
              className="
                relative
                mt-3
              "
            >

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                required
                autoComplete="new-password"
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm your new password"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-neutral-200
                  px-6
                  py-4
                  pr-14
                  text-neutral-900
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[#C8A96A]
                  focus:ring-4
                  focus:ring-[#C8A96A]/10
                "
              />


              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-neutral-400
                  transition-colors
                  hover:text-[#C8A96A]
                "
              >

                {showConfirmPassword ? (
                  <EyeOff
                    size={20}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Eye
                    size={20}
                    strokeWidth={1.8}
                  />
                )}

              </button>

            </div>

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
              ? "Updating Password..."
              : "Reset Password"}

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