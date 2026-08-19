"use client";

import {
  useRef,
  useState,
} from "react";


// ============================================================
// TYPES
// ============================================================

type PaymentProofFormProps = {
  publicToken: string;

  initialProofUrl?: string | null;

  initialStatus?: string;
};


// ============================================================
// COMPONENT
// ============================================================

export default function PaymentProofForm({
  publicToken,
  initialProofUrl = null,
  initialStatus = "PENDING",
}: PaymentProofFormProps) {

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );


  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null
  );


  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string | null>(
    initialProofUrl
  );


  const [
    uploading,
    setUploading,
  ] = useState(false);


  const [
    submitted,
    setSubmitted,
  ] = useState(
    initialStatus ===
      "SUBMITTED" ||
    initialStatus ===
      "VERIFIED"
  );


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  // ==========================================================
  // FILE SELECT
  // ==========================================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    setError(null);


    const file =
      event.target.files?.[0] ??
      null;


    if (!file) {
      return;
    }


    // ========================================================
    // FILE TYPE
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
        "Please upload a JPG, PNG or WEBP image."
      );


      event.target.value = "";

      return;

    }


    // ========================================================
    // FILE SIZE
    // ========================================================

    const maxSize =
      10 * 1024 * 1024;


    if (
      file.size >
      maxSize
    ) {

      setError(
        "Payment receipt must be 10MB or smaller."
      );


      event.target.value = "";

      return;

    }


    // ========================================================
    // PREVIEW
    // ========================================================

    if (previewUrl &&
        !previewUrl.startsWith(
          "http"
        )) {

      URL.revokeObjectURL(
        previewUrl
      );

    }


    const objectUrl =
      URL.createObjectURL(
        file
      );


    setSelectedFile(
      file
    );


    setPreviewUrl(
      objectUrl
    );

  }


  // ==========================================================
  // REMOVE FILE
  // ==========================================================

  function handleRemove() {

    if (
      previewUrl &&
      !previewUrl.startsWith(
        "http"
      )
    ) {

      URL.revokeObjectURL(
        previewUrl
      );

    }


    setSelectedFile(
      null
    );


    setPreviewUrl(
      initialProofUrl
    );


    setError(
      null
    );


    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }

  }


  // ==========================================================
  // UPLOAD + SUBMIT
  // ==========================================================

  async function handleSubmit() {

    setError(null);


    if (!selectedFile) {

      setError(
        "Please select your payment receipt first."
      );

      return;

    }


    setUploading(
      true
    );


    try {

      // ======================================================
      // STEP 1
      // Upload to Cloudinary
      // ======================================================

      const formData =
        new FormData();


      formData.append(
        "file",
        selectedFile
      );


      formData.append(
        "folder",
        "payment-proofs"
      );


      const uploadResponse =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );


      const uploadData =
        await uploadResponse.json();


      if (
        !uploadResponse.ok
      ) {

        throw new Error(
          uploadData?.error ??
            "Payment receipt upload failed."
        );

      }


      const proofUrl =
        uploadData?.url;


      const proofPublicId =
        uploadData?.publicId;


      if (
        !proofUrl ||
        !proofPublicId
      ) {

        throw new Error(
          "Payment receipt upload returned incomplete information."
        );

      }


      // ======================================================
      // STEP 2
      // Save proof to Payment
      // ======================================================

      const submitResponse =
        await fetch(
          "/api/payment/proof",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              publicToken,

              proofUrl,

              proofPublicId,
            }),

          }
        );


      const submitData =
        await submitResponse.json();


      if (
        !submitResponse.ok
      ) {

        throw new Error(
          submitData?.error ??
            "Unable to submit payment proof."
        );

      }


      // ======================================================
      // SUCCESS
      // ======================================================

      setSubmitted(
        true
      );


      setSelectedFile(
        null
      );


      setPreviewUrl(
        proofUrl
      );


    } catch (
      submissionError
    ) {

      console.error(
        "Payment proof submission error:",
        submissionError
      );


      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit payment proof."
      );


    } finally {

      setUploading(
        false
      );

    }

  }


  // ==========================================================
  // VERIFIED
  // ==========================================================

  if (
    initialStatus ===
    "VERIFIED"
  ) {

    return (
      <div
        className="
          rounded-3xl
          border
          border-neutral-200
          bg-white
          p-6
          shadow-sm
          sm:p-8
        "
      >

        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-neutral-400
          "
        >
          PAYMENT STATUS
        </p>


        <div
          className="
            mt-5
            flex
            items-start
            gap-4
          "
        >

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-green-50
              text-lg
              text-green-600
            "
          >
            ✓
          </div>


          <div>

            <h3
              className="
                font-medium
                text-neutral-900
              "
            >
              Payment Verified
            </h3>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-neutral-500
              "
            >
              Your payment has been
              verified successfully.
            </p>

          </div>

        </div>


        {previewUrl && (
          <div
            className="
              mt-6
              overflow-hidden
              rounded-2xl
              border
              border-neutral-200
              bg-neutral-50
            "
          >

            <img
              src={previewUrl}
              alt="Payment receipt"
              className="
                max-h-[420px]
                w-full
                object-contain
              "
            />

          </div>
        )}

      </div>
    );

  }


  // ==========================================================
  // SUBMITTED
  // ==========================================================

  if (
    submitted
  ) {

    return (
      <div
        className="
          rounded-3xl
          border
          border-neutral-200
          bg-white
          p-6
          shadow-sm
          sm:p-8
        "
      >

        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-neutral-400
          "
        >
          PAYMENT PROOF
        </p>


        <div
          className="
            mt-5
            flex
            items-start
            gap-4
          "
        >

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-green-50
              text-lg
              text-green-600
            "
          >
            ✓
          </div>


          <div>

            <h3
              className="
                font-medium
                text-neutral-900
              "
            >
              Payment Proof Submitted
            </h3>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-neutral-500
              "
            >
              Thank you. Our team will
              review your payment and
              update your order shortly.
            </p>

          </div>

        </div>


        {previewUrl && (
          <div
            className="
              mt-6
              overflow-hidden
              rounded-2xl
              border
              border-neutral-200
              bg-neutral-50
            "
          >

            <img
              src={previewUrl}
              alt="Submitted payment receipt"
              className="
                max-h-[420px]
                w-full
                object-contain
              "
            />

          </div>
        )}

      </div>
    );

  }


  // ==========================================================
  // DEFAULT FORM
  // ==========================================================

  return (
    <div
      className="
        rounded-3xl
        border
        border-neutral-200
        bg-white
        p-6
        shadow-sm
        sm:p-8
      "
    >

      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.3em]
          text-neutral-400
        "
      >
        PAYMENT PROOF
      </p>


      <h2
        className="
          mt-2
          text-2xl
          font-light
          text-neutral-900
        "
      >
        Upload Payment Receipt
      </h2>


      <p
        className="
          mt-3
          text-sm
          leading-6
          text-neutral-500
        "
      >
        After completing your payment,
        please upload your payment receipt
        for verification.
      </p>


      {/* ==================================================== */}
      {/* ERROR */}
      {/* ==================================================== */}

      {error && (
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            leading-6
            text-red-700
          "
        >
          {error}
        </div>
      )}


      {/* ==================================================== */}
      {/* PREVIEW */}
      {/* ==================================================== */}

      {previewUrl ? (

        <div
          className="
            relative
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-neutral-200
            bg-neutral-50
          "
        >

          <img
            src={previewUrl}
            alt="Payment receipt preview"
            className="
              max-h-[420px]
              w-full
              object-contain
            "
          />


          {!uploading && (
            <button
              type="button"
              onClick={
                handleRemove
              }
              className="
                absolute
                right-3
                top-3
                rounded-full
                bg-white
                px-4
                py-2
                text-xs
                font-medium
                text-neutral-700
                shadow-lg
                transition
                hover:bg-neutral-100
              "
            >
              Remove
            </button>
          )}

        </div>

      ) : (

        /* ================================================== */
        /* UPLOAD BOX */
        /* ================================================== */

        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="
            mt-6
            flex
            min-h-[220px]
            w-full
            flex-col
            items-center
            justify-center
            rounded-3xl
            border
            border-dashed
            border-neutral-300
            bg-neutral-50
            px-6
            text-center
            transition
            hover:border-neutral-500
            hover:bg-neutral-100
          "
        >

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-white
              text-2xl
              shadow-sm
            "
          >
            ↑
          </div>


          <p
            className="
              mt-5
              text-sm
              font-medium
              text-neutral-900
            "
          >
            Upload Payment Receipt
          </p>


          <p
            className="
              mt-2
              text-xs
              leading-5
              text-neutral-500
            "
          >
            JPG, PNG or WEBP · Maximum 10MB
          </p>

        </button>

      )}


      {/* ==================================================== */}
      {/* HIDDEN FILE INPUT */}
      {/* ==================================================== */}

      <input
        ref={fileInputRef}
        type="file"
        accept="
          image/jpeg,
          image/jpg,
          image/png,
          image/webp
        "
        onChange={
          handleFileChange
        }
        className="hidden"
      />


      {/* ==================================================== */}
      {/* SUBMIT */}
      {/* ==================================================== */}

      {selectedFile && (
        <button
          type="button"
          onClick={
            handleSubmit
          }
          disabled={uploading}
          className="
            mt-6
            flex
            min-h-14
            w-full
            items-center
            justify-center
            rounded-full
            bg-black
            px-6
            text-sm
            font-medium
            text-white
            transition
            hover:bg-neutral-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          {uploading
            ? "Submitting Payment Proof..."
            : "Submit Payment Proof"}

        </button>
      )}


      {/* ==================================================== */}
      {/* SECURITY NOTE */}
      {/* ==================================================== */}

      <p
        className="
          mt-5
          text-center
          text-[11px]
          leading-5
          text-neutral-400
        "
      >
        Your payment receipt will be reviewed
        manually by our team.
      </p>

    </div>
  );
}