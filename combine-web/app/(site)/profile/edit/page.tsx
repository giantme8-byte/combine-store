"use client";

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Trash2,
} from "lucide-react";


// ============================================================
// PROPS
// ============================================================

type EditProfileFormProps = {
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  image: string | null;
};


// ============================================================
// COMPONENT
// ============================================================

export default function EditProfileForm({
  name: initialName,
  email,
  phone: initialPhone,
  dateOfBirth: initialDateOfBirth,
  image: initialImage,
}: EditProfileFormProps) {

  const router =
    useRouter();


  // ==========================================================
  // FILE INPUT
  // ==========================================================

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );


  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [
    name,
    setName,
  ] = useState(
    initialName ?? ""
  );


  const [
    phone,
    setPhone,
  ] = useState(
    initialPhone ?? ""
  );


  const [
    dateOfBirth,
    setDateOfBirth,
  ] = useState(
    initialDateOfBirth
      ? initialDateOfBirth.slice(0, 10)
      : ""
  );


  const [
    image,
    setImage,
  ] = useState(
    initialImage ?? ""
  );


  // ==========================================================
  // UPLOAD STATE
  // ==========================================================

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);


  // ==========================================================
  // SAVE STATE
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
  // AVATAR LETTER
  // ==========================================================

  const avatarLetter =
    (name ?? "")
      .trim()
      .charAt(0)
      .toUpperCase();


  // ==========================================================
  // OPEN FILE PICKER
  // ==========================================================

  function handleChooseImage() {

    if (
      uploadingImage ||
      loading
    ) {
      return;
    }


    fileInputRef.current?.click();
  }


  // ==========================================================
  // IMAGE UPLOAD
  // ==========================================================

  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];


    // Reset input so the same file
    // can be selected again later.

    event.target.value = "";


    if (!file) {
      return;
    }


    // ========================================================
    // VALIDATE TYPE
    // ========================================================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setError(
        "Please choose a JPG, PNG or WEBP image."
      );

      setSuccess("");

      return;
    }


    // ========================================================
    // VALIDATE SIZE
    // ========================================================

    const maxSize =
      5 * 1024 * 1024;


    if (
      file.size >
      maxSize
    ) {

      setError(
        "Profile photo must be smaller than 5MB."
      );

      setSuccess("");

      return;
    }


    setError("");
    setSuccess("");
    setUploadingImage(true);


    try {

      // ======================================================
      // FORM DATA
      // ======================================================

      const formData =
        new FormData();


      formData.append(
        "file",
        file
      );


      formData.append(
        "folder",
        "avatars"
      );


      // ======================================================
      // UPLOAD
      // ======================================================

      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );


      const data =
        await response.json();


      // ======================================================
      // UPLOAD ERROR
      // ======================================================

      if (
        !response.ok ||
        !data.url
      ) {

        throw new Error(
          data.error ??
          "Failed to upload profile photo."
        );
      }


      // ======================================================
      // UPDATE PREVIEW
      // ======================================================

      setImage(
        data.url
      );


      setSuccess(
        "Profile photo uploaded. Click Save Changes to keep it."
      );


    } catch (error) {

      console.error(
        "Avatar upload error:",
        error
      );


      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload profile photo."
      );


    } finally {

      setUploadingImage(false);
    }
  }


  // ==========================================================
  // REMOVE IMAGE
  // ==========================================================

  function handleRemoveImage() {

    if (
      uploadingImage ||
      loading
    ) {
      return;
    }


    setImage("");


    setSuccess(
      "Profile photo removed. Click Save Changes to confirm."
    );


    setError("");
  }


  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (
      loading ||
      uploadingImage
    ) {
      return;
    }


    setLoading(true);
    setSuccess("");
    setError("");


    try {

      // ======================================================
      // UPDATE PROFILE
      // ======================================================

      const response =
        await fetch(
          "/api/auth/profile",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name,
                phone,
                dateOfBirth,
                image,
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
          "Failed to update your profile."
        );

        return;
      }


      // ======================================================
      // SUCCESS
      // ======================================================

      setSuccess(
        "Your profile has been updated successfully."
      );


      router.refresh();


    } catch (error) {

      console.error(
        "Profile update error:",
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
  // RENDER
  // ==========================================================

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

      {/* ======================================================
          HEADER
      ====================================================== */}

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
          Edit Profile
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
          Keep your personal information
          up to date.
        </p>

      </div>


      {/* ======================================================
          FORM
      ====================================================== */}

      <div
        className="
          mx-auto
          max-w-3xl
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
              AVATAR
          ================================================== */}

          <div
            className="
              flex
              flex-col
              items-center
              border-b
              border-neutral-200
              pb-10
            "
          >

            <div
              className="
                relative
              "
            >

              <div
                className="
                  flex
                  h-32
                  w-32
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-b
                  from-black
                  to-neutral-700
                  text-4xl
                  font-light
                  text-white
                  ring-4
                  ring-neutral-100
                "
              >

                {image ? (

                  <img
                    src={image}
                    alt={
                      name ||
                      "Profile photo"
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                ) : (

                  <span>
                    {avatarLetter ||
                      "👤"}
                  </span>

                )}

              </div>


              {/* =================================================
                  UPLOADING OVERLAY
              ================================================= */}

              {uploadingImage && (

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    rounded-full
                    bg-black/60
                    text-white
                  "
                >

                  <Loader2
                    size={28}
                    className="
                      animate-spin
                    "
                  />

                </div>

              )}

            </div>


            <p
              className="
                mt-5
                text-[11px]
                uppercase
                tracking-[0.3em]
                text-neutral-400
              "
            >
              Profile Photo
            </p>


            <p
              className="
                mt-2
                text-center
                text-sm
                text-neutral-400
              "
            >
              JPG, PNG or WEBP · Max 5MB
            </p>


            <input
              ref={
                fileInputRef
              }
              type="file"
              accept="
                image/jpeg,
                image/jpg,
                image/png,
                image/webp
              "
              className="hidden"
              onChange={
                handleImageChange
              }
              disabled={
                uploadingImage ||
                loading
              }
            />


            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
              "
            >

              {/* CHANGE PHOTO */}

              <button
                type="button"
                onClick={
                  handleChooseImage
                }
                disabled={
                  uploadingImage ||
                  loading
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-neutral-200
                  px-5
                  py-3
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-neutral-700
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#C8A96A]
                  hover:text-[#C8A96A]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {uploadingImage ? (

                  <>
                    <Loader2
                      size={15}
                      className="
                        animate-spin
                      "
                    />

                    Uploading...
                  </>

                ) : (

                  <>
                    <ImagePlus
                      size={15}
                    />

                    Change Photo
                  </>

                )}

              </button>


              {/* REMOVE PHOTO */}

              {image &&
                !uploadingImage && (

                  <button
                    type="button"
                    onClick={
                      handleRemoveImage
                    }
                    disabled={
                      loading
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-red-200
                      px-5
                      py-3
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.25em]
                      text-red-500
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-red-400
                      hover:bg-red-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    <Trash2
                      size={15}
                    />

                    Remove

                  </button>

                )}

            </div>


            <p
              className="
                mt-4
                max-w-md
                text-center
                text-xs
                leading-5
                text-neutral-400
              "
            >
              Your photo will be uploaded securely
              and saved to your account when you
              click Save Changes.
            </p>

          </div>


          {/* ==================================================
              FIELDS
          ================================================== */}

          <div
            className="
              mt-10
              space-y-8
            "
          >

            {/* =================================================
                NAME
            ================================================= */}

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
                minLength={2}
                autoComplete="name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Enter your name"
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


            {/* =================================================
                EMAIL
            ================================================= */}

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
                Email Address
              </label>


              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="
                  mt-3
                  w-full
                  cursor-not-allowed
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-neutral-50
                  px-6
                  py-4
                  text-neutral-500
                  outline-none
                "
              />


              <p
                className="
                  mt-3
                  text-xs
                  text-neutral-400
                "
              >
                Email address cannot be changed here.
              </p>

            </div>


            {/* =================================================
                DATE OF BIRTH
            ================================================= */}

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
                autoComplete="bday"
                value={
                  dateOfBirth
                }
                onChange={(event) =>
                  setDateOfBirth(
                    event.target.value
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
                Keep your birthday up to date so
                we can send you birthday benefits
                and special offers.
              </p>

            </div>


            {/* =================================================
                PHONE
            ================================================= */}

            <div>

              <label
                htmlFor="phone"
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.35em]
                  text-neutral-400
                "
              >
                Phone Number
              </label>


              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="Enter your phone number"
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
              disabled={
                loading ||
                uploadingImage
              }
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

                  Saving...
                </>

              ) : (

                "Save Changes"

              )}

            </button>

          </div>

        </form>

      </div>

    </main>
  );
}