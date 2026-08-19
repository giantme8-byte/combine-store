"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";


// ============================================================
// COMPONENT
// ============================================================

export default function ChangePasswordPage() {

  const router =
    useRouter();


  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");


  const [
    newPassword,
    setNewPassword,
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  // ==========================================================
  // VISIBILITY
  // ==========================================================

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);


  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);


  // ==========================================================
  // STATUS
  // ==========================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    success,
    setSuccess,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (loading) {
      return;
    }


    setSuccess("");
    setError("");


    // ========================================================
    // CLIENT VALIDATION
    // ========================================================

    if (
      newPassword.length < 8
    ) {

      setError(
        "New password must be at least 8 characters."
      );

      return;
    }


    if (
      newPassword !==
      confirmPassword
    ) {

      setError(
        "New passwords do not match."
      );

      return;
    }


    setLoading(true);


    try {

      // ======================================================
      // API
      // ======================================================

      const response =
        await fetch(
          "/api/auth/password",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword,
              }),
          }
        );


      const data =
        await response.json();


      // ======================================================
      // ERROR
      // ======================================================

      if (
        !response.ok
      ) {

        setError(
          data.message ??
          "Failed to change your password."
        );

        return;
      }


      // ======================================================
      // SUCCESS
      // ======================================================

      setSuccess(
        "Your password has been changed successfully. 🔐"
      );


      // Clear password fields.

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");


      // Refresh current account data.

      router.refresh();


    } catch (error) {

      console.error(
        "Password change error:",
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
  // PASSWORD FIELD
  // ==========================================================

  function PasswordField({
    id,
    label,
    value,
    onChange,
    visible,
    onToggle,
    placeholder,
    autoComplete,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (
      value: string
    ) => void;
    visible: boolean;
    onToggle: () => void;
    placeholder: string;
    autoComplete: string;
  }) {

    return (
      <div>

        <label
          htmlFor={id}
          className="
            text-[11px]
            uppercase
            tracking-[0.35em]
            text-neutral-400
          "
        >
          {label}
        </label>


        <div
          className="
            relative
            mt-3
          "
        >

          <input
            id={id}
            type={
              visible
                ? "text"
                : "password"
            }
            required
            autoComplete={
              autoComplete
            }
            value={value}
            onChange={(event) =>
              onChange(
                event.target.value
              )
            }
            placeholder={
              placeholder
            }
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
            onClick={onToggle}
            tabIndex={-1}
            aria-label={
              visible
                ? `Hide ${label}`
                : `Show ${label}`
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              rounded-full
              p-2
              text-neutral-400
              transition
              hover:text-[#C8A96A]
            "
          >

            {visible ? (

              <EyeOff
                size={19}
              />

            ) : (

              <Eye
                size={19}
              />

            )}

          </button>

        </div>

      </div>
    );

  }


  return (
    <main
      className="
        mx-auto
        max-w-[1440px]
        px-8
        pb-32
        pt-36
        lg:px-12
      "
    >


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div
        className="
          mx-auto
          mb-16
          max-w-4xl
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
            md:text-6xl
          "
        >
          Change Password
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
            max-w-2xl
            text-lg
            leading-8
            text-neutral-500
          "
        >
          Keep your account secure by
          regularly updating your password.
        </p>

      </div>



      {/* ========================================================
          FORM
      ======================================================== */}

      <div
        className="
          mx-auto
          max-w-2xl
        "
      >

        <form
          onSubmit={
            handleSubmit
          }
          className="
            rounded-[36px]
            border
            border-neutral-200
            bg-white
            p-8
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
            md:p-12
          "
        >


          {/* ==================================================
              SECURITY INTRO
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-neutral-50
              px-6
              py-5
            "
          >

            <p
              className="
                text-[11px]
                uppercase
                tracking-[0.3em]
                text-neutral-400
              "
            >
              Account Security
            </p>


            <p
              className="
                mt-2
                text-sm
                leading-6
                text-neutral-500
              "
            >
              Choose a strong password with
              at least 8 characters.
            </p>

          </div>



          {/* ==================================================
              PASSWORD FIELDS
          ================================================== */}

          <div
            className="
              mt-10
              space-y-8
            "
          >

            <PasswordField
              id="currentPassword"
              label="Current Password"
              value={
                currentPassword
              }
              onChange={
                setCurrentPassword
              }
              visible={
                showCurrentPassword
              }
              onToggle={() =>
                setShowCurrentPassword(
                  (value) =>
                    !value
                )
              }
              placeholder="Enter your current password"
              autoComplete="current-password"
            />


            <PasswordField
              id="newPassword"
              label="New Password"
              value={
                newPassword
              }
              onChange={
                setNewPassword
              }
              visible={
                showNewPassword
              }
              onToggle={() =>
                setShowNewPassword(
                  (value) =>
                    !value
                )
              }
              placeholder="Enter your new password"
              autoComplete="new-password"
            />


            <PasswordField
              id="confirmPassword"
              label="Confirm New Password"
              value={
                confirmPassword
              }
              onChange={
                setConfirmPassword
              }
              visible={
                showConfirmPassword
              }
              onToggle={() =>
                setShowConfirmPassword(
                  (value) =>
                    !value
                )
              }
              placeholder="Confirm your new password"
              autoComplete="new-password"
            />

          </div>



          {/* ==================================================
              MESSAGE
          ================================================== */}

          {success && (

            <div
              className="
                mt-8
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-emerald-200
                bg-emerald-50
                px-5
                py-4
                text-sm
                text-emerald-700
              "
            >

              <Check
                size={18}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <span>
                {success}
              </span>

            </div>

          )}


          {error && (

            <div
              className="
                mt-8
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



          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div
            className="
              mt-10
              flex
              flex-col-reverse
              gap-4
              sm:flex-row
              sm:justify-between
            "
          >

            <Link
              href="/profile"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-neutral-200
                px-8
                py-4
                text-[11px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-neutral-600
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-neutral-900
                hover:text-neutral-900
              "
            >

              <ArrowLeft
                size={16}
              />

              Back to Profile

            </Link>


            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-full
                bg-black
                px-10
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

              {loading ? (

                <>
                  <Loader2
                    size={16}
                    className="
                      animate-spin
                    "
                  />

                  Updating...

                </>

              ) : (

                "Change Password"

              )}

            </button>

          </div>

        </form>

      </div>

    </main>
  );
}