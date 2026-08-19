"use client";

import Image from "next/image";

import {
  useRef,
  useState,
} from "react";

import {
  Loader2,
  Upload,
  X,
} from "lucide-react";

type PaymentMethodType =
  | "BANK_TRANSFER"
  | "QR";

type PaymentMethodData = {
  id?: number;

  name: string;

  type: PaymentMethodType;

  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;

  qrImageUrl: string | null;
  qrPublicId: string | null;

  instructions: string | null;

  active: boolean;
  sortOrder: number;
};

type Props = {
  paymentMethod?: PaymentMethodData;

  action: (
    formData: FormData
  ) => void | Promise<void>;
};

export default function PaymentMethodForm({
  paymentMethod,
  action,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [type, setType] =
    useState<PaymentMethodType>(
      paymentMethod?.type ??
        "BANK_TRANSFER"
    );

  const [qrImageUrl, setQrImageUrl] =
    useState(
      paymentMethod?.qrImageUrl ?? ""
    );

  const [qrPublicId, setQrPublicId] =
    useState(
      paymentMethod?.qrPublicId ?? ""
    );

  const [uploading, setUploading] =
    useState(false);

  const [uploadError, setUploadError] =
    useState("");

  const [dragging, setDragging] =
    useState(false);

  async function uploadQrImage(
    file: File
  ) {
    if (!file.type.startsWith("image/")) {
      setUploadError(
        "Please select an image file."
      );

      return;
    }

    setUploadError("");
    setUploading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "folder",
        "payment-methods"
      );

      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Upload failed."
        );
      }

      if (!result.url) {
        throw new Error(
          "Upload completed but no image URL was returned."
        );
      }

      setQrImageUrl(
        result.url
      );

      setQrPublicId(
        result.publicId ?? ""
      );
    } catch (error) {
      console.error(
        "QR upload error:",
        error
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    void uploadQrImage(file);

    event.target.value = "";
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    void uploadQrImage(file);
  }

  function removeQrImage() {
    setQrImageUrl("");
    setQrPublicId("");
    setUploadError("");
  }

  return (
    <form
      action={action}
      className="space-y-8"
    >
      {/* =========================================================
          HIDDEN VALUES
          ========================================================= */}

      <input
        type="hidden"
        name="qrImageUrl"
        value={qrImageUrl}
      />

      <input
        type="hidden"
        name="qrPublicId"
        value={qrPublicId}
      />

      {/* =========================================================
          BASIC INFORMATION
          ========================================================= */}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            Payment Method
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Configure the payment method customers
            will see during checkout.
          </p>
        </div>

        <div className="space-y-6">
          {/* Name */}

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-900"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              required
              defaultValue={
                paymentMethod?.name ??
                ""
              }
              placeholder="Maybank Bank Transfer"
              className="
                w-full
                rounded-xl
                border
                border-neutral-200
                bg-white
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-neutral-100
              "
            />
          </div>

          {/* Type */}

          <div className="space-y-2">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-neutral-900"
            >
              Payment Type
            </label>

            <select
              id="type"
              name="type"
              value={type}
              onChange={(event) =>
                setType(
                  event.target
                    .value as PaymentMethodType
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-neutral-200
                bg-white
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-neutral-100
              "
            >
              <option value="BANK_TRANSFER">
                Bank Transfer
              </option>

              <option value="QR">
                QR Payment
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* =========================================================
          BANK TRANSFER
          ========================================================= */}

      {type ===
        "BANK_TRANSFER" && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Bank Details
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral-500">
              These details will be displayed to
              customers when they choose bank transfer.
            </p>
          </div>

          <div className="space-y-6">
            {/* Bank Name */}

            <div className="space-y-2">
              <label
                htmlFor="bankName"
                className="block text-sm font-medium text-neutral-900"
              >
                Bank Name
              </label>

              <input
                id="bankName"
                name="bankName"
                defaultValue={
                  paymentMethod?.bankName ??
                  ""
                }
                placeholder="Maybank"
                className="
                  w-full
                  rounded-xl
                  border
                  border-neutral-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-neutral-400
                  focus:ring-2
                  focus:ring-neutral-100
                "
              />
            </div>

            {/* Account Name */}

            <div className="space-y-2">
              <label
                htmlFor="accountName"
                className="block text-sm font-medium text-neutral-900"
              >
                Account Name
              </label>

              <input
                id="accountName"
                name="accountName"
                defaultValue={
                  paymentMethod?.accountName ??
                  ""
                }
                placeholder="COMBINE"
                className="
                  w-full
                  rounded-xl
                  border
                  border-neutral-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-neutral-400
                  focus:ring-2
                  focus:ring-neutral-100
                "
              />
            </div>

            {/* Account Number */}

            <div className="space-y-2">
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-neutral-900"
              >
                Account Number
              </label>

              <input
                id="accountNumber"
                name="accountNumber"
                defaultValue={
                  paymentMethod?.accountNumber ??
                  ""
                }
                placeholder="1234567890"
                inputMode="numeric"
                className="
                  w-full
                  rounded-xl
                  border
                  border-neutral-200
                  px-4
                  py-3
                  font-mono
                  text-sm
                  outline-none
                  transition
                  focus:border-neutral-400
                  focus:ring-2
                  focus:ring-neutral-100
                "
              />
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          QR PAYMENT
          ========================================================= */}

      {type === "QR" && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              QR Payment
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral-500">
              Upload the QR code customers should use
              to make payment.
            </p>
          </div>

          <div className="space-y-5">
            {/* Upload Area */}

            {!qrImageUrl ? (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => {
                  setDragging(false);
                }}
                onDrop={handleDrop}
                onClick={() => {
                  if (!uploading) {
                    fileInputRef.current?.click();
                  }
                }}
                className={`
                  flex
                  min-h-72
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-dashed
                  px-6
                  text-center
                  transition
                  ${
                    dragging
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-50"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleFileChange
                  }
                />

                {uploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />

                    <p className="mt-4 text-sm font-medium text-neutral-800">
                      Uploading...
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      Uploading QR code to Cloudinary
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <Upload className="h-5 w-5 text-neutral-500" />
                    </div>

                    <p className="mt-4 text-sm font-medium text-neutral-800">
                      Upload QR Code
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      Click to select or drag and drop
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      PNG, JPG or WEBP
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex flex-col items-center">
                  <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-3">
                    <Image
                      src={qrImageUrl}
                      alt="Payment QR Code"
                      width={280}
                      height={280}
                      className="h-auto max-h-72 w-auto max-w-full object-contain"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      disabled={uploading}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-neutral-200
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-neutral-700
                        transition
                        hover:bg-neutral-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}

                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={
                        removeQrImage
                      }
                      disabled={uploading}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-red-200
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-red-600
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <X className="h-4 w-4" />

                      Remove
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handleFileChange
                    }
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <p className="text-sm text-red-600">
                {uploadError}
              </p>
            )}
          </div>
        </section>
      )}

      {/* =========================================================
          INSTRUCTIONS
          ========================================================= */}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            Customer Instructions
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Optional instructions displayed together with
            this payment method.
          </p>
        </div>

        <textarea
          name="instructions"
          rows={5}
          defaultValue={
            paymentMethod?.instructions ??
            ""
          }
          placeholder="Please transfer the exact amount and send your payment receipt via WhatsApp after payment."
          className="
            w-full
            rounded-xl
            border
            border-neutral-200
            px-4
            py-3
            text-sm
            leading-6
            outline-none
            transition
            focus:border-neutral-400
            focus:ring-2
            focus:ring-neutral-100
          "
        />
      </section>

      {/* =========================================================
          DISPLAY SETTINGS
          ========================================================= */}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            Display Settings
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Control whether this payment method is available
            to customers and its display order.
          </p>
        </div>

        <div className="space-y-6">
          {/* Active */}

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="active"
              defaultChecked={
                paymentMethod?.active ??
                true
              }
              className="mt-1 h-4 w-4 rounded border-neutral-300"
            />

            <span>
              <span className="block text-sm font-medium text-neutral-900">
                Active
              </span>

              <span className="mt-1 block text-xs leading-5 text-neutral-500">
                Customers can use this payment method when
                it is active.
              </span>
            </span>
          </label>

          {/* Sort Order */}

          <div className="max-w-xs space-y-2">
            <label
              htmlFor="sortOrder"
              className="block text-sm font-medium text-neutral-900"
            >
              Sort Order
            </label>

            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min="0"
              step="1"
              defaultValue={
                paymentMethod?.sortOrder ??
                9999
              }
              className="
                w-full
                rounded-xl
                border
                border-neutral-200
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-neutral-100
              "
            />

            <p className="text-xs text-neutral-400">
              Lower numbers appear first.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SUBMIT
          ========================================================= */}

      <button
        type="submit"
        disabled={uploading}
        className="
          w-full
          rounded-xl
          bg-black
          py-4
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-neutral-800
          disabled:cursor-not-allowed
          disabled:bg-neutral-400
        "
      >
        {uploading
          ? "Uploading QR Code..."
          : paymentMethod
            ? "Save Payment Method"
            : "Create Payment Method"}
      </button>
    </form>
  );
}