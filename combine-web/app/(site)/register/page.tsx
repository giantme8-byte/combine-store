"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

export default function RegisterPage() {
  const router =
    useRouter();

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    dateOfBirth,
    setDateOfBirth,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");


    // ==========================================================
    // PASSWORD MATCH
    // ==========================================================

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }


    // ==========================================================
    // DATE OF BIRTH
    // ==========================================================

    if (!dateOfBirth) {
      setError(
        "Please enter your date of birth."
      );

      return;
    }


    try {
      setLoading(true);


      // ========================================================
      // REGISTER REQUEST
      // ========================================================

      const res =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name,
                email,
                password,
                dateOfBirth,
              }),
          }
        );


      // ========================================================
      // RESPONSE
      // ========================================================

      const data =
        await res.json();


      // ========================================================
      // FAILED
      // ========================================================

      if (!res.ok) {
        setError(
          data.message ??
            "Unable to create your account."
        );

        return;
      }


      // ========================================================
      // SUCCESS
      // ========================================================

      router.push(
        "/login"
      );

      router.refresh();


    } catch (error) {

      console.error(
        error
      );

      setError(
        "Something went wrong. Please try again."
      );


    } finally {

      setLoading(false);

    }
  }


  // ============================================================
  // RENDER
  // ============================================================

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

        {/* ==================================================== */}
        {/* HEADER */}
        {/* ==================================================== */}

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
            Create Account
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
            Join COMBINE to save your favourite
            collections, manage enquiries and enjoy
            a personalised luxury shopping experience.
          </p>

        </div>


        {/* ==================================================== */}
        {/* FORM */}
        {/* ==================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            mt-14
            space-y-8
          "
        >

          {/* ================================================== */}
          {/* FULL NAME */}
          {/* ================================================== */}

          <div>

            <label
              htmlFor="name"
              className="
                text-[11px]
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
              Full Name
            </label>


            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(
                e
              ) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter your full name"
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


          {/* ================================================== */}
          {/* EMAIL */}
          {/* ================================================== */}

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
              onChange={(
                e
              ) =>
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


          {/* ================================================== */}
          {/* DATE OF BIRTH */}
          {/* ================================================== */}

          <div>

            <label
              htmlFor="dateOfBirth"
              className="
                text-[11px]
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
              Date of Birth
            </label>


            <input
              id="dateOfBirth"
              type="date"
              required
              autoComplete="bday"
              value={
                dateOfBirth
              }
              onChange={(
                e
              ) =>
                setDateOfBirth(
                  e.target.value
                )
              }
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


            <p
              className="
                mt-3
                text-xs
                leading-5
                text-neutral-400
              "
            >
              Your date of birth helps us
              provide birthday benefits and
              special offers.
            </p>

          </div>


          {/* ================================================== */}
          {/* PASSWORD */}
          {/* ================================================== */}

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
              Password
            </label>


            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(
                e
              ) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Create a password"
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


          {/* ================================================== */}
          {/* CONFIRM PASSWORD */}
          {/* ================================================== */}

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


            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={
                confirmPassword
              }
              onChange={(
                e
              ) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm your password"
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


          {/* ================================================== */}
          {/* ERROR */}
          {/* ================================================== */}

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


          {/* ================================================== */}
          {/* SUBMIT */}
          {/* ================================================== */}

          <button
            type="submit"
            disabled={
              loading
            }
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
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* ==================================================== */}
        {/* SIGN IN */}
        {/* ==================================================== */}

        <div
          className="
            mt-12
            border-t
            border-neutral-200
            pt-10
            text-center
          "
        >

          <p
            className="
              text-neutral-500
            "
          >
            Already have an account?
          </p>


          <Link
            href="/login"
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
            Sign In
          </Link>

        </div>

      </div>

    </main>
  );
}