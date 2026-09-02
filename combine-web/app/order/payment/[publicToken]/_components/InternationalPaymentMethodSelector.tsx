"use client";

import {
  Check,
  CreditCard,
  Loader2,
  QrCode,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

// ============================================================
// TYPES
// ============================================================

type PaymentMethodType =
  | "BANK_TRANSFER"
  | "QR"
  | "PAYPAL"
  | "WISE";

type PaymentMethod = {
  id: number;
  name: string;
  type: PaymentMethodType;

  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;

  qrImageUrl: string | null;

  instructions: string | null;

  wiseName: string | null;
  wiseEmail: string | null;
  wiseAccount: string | null;
};

type Props = {
  publicToken: string;
  amount: number;
};

// ============================================================
// FORMAT MONEY
// ============================================================

function formatAmount(
  amount: number
) {
  return new Intl.NumberFormat(
    "en-MY",
    {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 2,
    }
  ).format(amount);
}

// ============================================================
// COMPONENT
// ============================================================

export default function InternationalPaymentMethodSelector({
  publicToken,
  amount,
}: Props) {
  const router = useRouter();

  const [
    paymentMethods,
    setPaymentMethods,
  ] = useState<PaymentMethod[]>([]);

  const [
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
  ] = useState<number | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // LOAD PAYMENT METHODS
  // ==========================================================

  useEffect(() => {
    let active = true;

    async function loadPaymentMethods() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            "/api/payment-methods",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load payment methods."
          );
        }

        if (!active) {
          return;
        }

        const methods =
          Array.isArray(data)
            ? data
            : [];

        setPaymentMethods(
          methods
        );

        if (methods.length > 0) {
          setSelectedPaymentMethodId(
            methods[0].id
          );
        }
      } catch (err) {
        console.error(
          "Load international payment methods error:",
          err
        );

        if (active) {
          setPaymentMethods([]);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load payment methods."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPaymentMethods();

    return () => {
      active = false;
    };
  }, []);

  const selectedPaymentMethod =
    paymentMethods.find(
      (method) =>
        method.id ===
        selectedPaymentMethodId
    ) ?? null;

  // ==========================================================
  // SELECT PAYMENT METHOD
  // ==========================================================

  async function handleContinue() {
    setError("");

    if (
      !selectedPaymentMethodId
    ) {
      setError(
        "Please select a payment method."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response =
        await fetch(
          `/api/orders/${encodeURIComponent(
            publicToken
          )}/payment-method`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              paymentMethodId:
                selectedPaymentMethodId,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to set payment method."
        );
      }

      router.refresh();
    } catch (err) {
      console.error(
        "Set international payment method error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to set payment method."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="mt-8">

      {/* ==================================================== */}
      {/* AMOUNT */}
      {/* ==================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-neutral-50
          p-5
        "
      >
        <p
          className="
            text-xs
            uppercase
            tracking-[0.2em]
            text-neutral-400
          "
        >
          Amount to Pay
        </p>

        <p
          className="
            mt-2
            text-2xl
            font-semibold
            tracking-tight
            text-neutral-900
          "
        >
          {formatAmount(amount)}
        </p>
      </div>

      {/* ==================================================== */}
      {/* PAYMENT METHODS */}
      {/* ==================================================== */}

      <div className="mt-6">

        <p
          className="
            text-xs
            uppercase
            tracking-[0.2em]
            text-neutral-400
          "
        >
          Choose Payment Method
        </p>

        {loading ? (
          <div
            className="
              mt-5
              flex
              items-center
              gap-3
              text-sm
              text-neutral-500
            "
          >
            <Loader2
              className="
                h-4
                w-4
                animate-spin
              "
            />

            Loading payment methods...
          </div>
        ) : paymentMethods.length === 0 ? (
          <div
            className="
              mt-5
              rounded-2xl
              border
              border-neutral-200
              bg-neutral-50
              p-5
              text-sm
              leading-6
              text-neutral-500
            "
          >
            No payment methods are
            currently available.
          </div>
        ) : (
          <div className="mt-5 space-y-3">

            {paymentMethods.map(
              (method) => {
                const selected =
                  selectedPaymentMethodId ===
                  method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setSelectedPaymentMethodId(
                        method.id
                      )
                    }
                    disabled={submitting}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition
                      ${
                        selected
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 bg-white hover:border-neutral-400"
                      }
                    `}
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
                        bg-neutral-100
                        text-neutral-700
                      "
                    >
                      {method.type ===
                      "QR" ? (
                        <QrCode className="h-5 w-5" />
                      ) : (
                        <CreditCard className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          text-sm
                          font-medium
                          text-neutral-900
                        "
                      >
                        {method.name}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-neutral-400
                        "
                      >
                        {method.type ===
                        "BANK_TRANSFER"
                          ? "Bank Transfer"
                          : method.type ===
                            "QR"
                            ? "QR Payment"
                            : method.type ===
                              "PAYPAL"
                              ? "PayPal"
                              : "Wise"}
                      </p>
                    </div>

                    {selected && (
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-black
                          text-white
                        "
                      >
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                );
              }
            )}

          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* SELECTED METHOD PREVIEW */}
      {/* ==================================================== */}

      {selectedPaymentMethod && (
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-5
          "
        >
          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Selected Payment Method
          </p>

          <p
            className="
              mt-2
              text-lg
              font-medium
              text-neutral-900
            "
          >
            {selectedPaymentMethod.name}
          </p>

          {selectedPaymentMethod.type ===
            "PAYPAL" && (
            <p
              className="
                mt-3
                text-xs
                leading-6
                text-neutral-500
              "
            >
              A 6% + RM2.00 payment processing
              fee will be added when paying
              via PayPal.
            </p>
          )}

          {selectedPaymentMethod.type ===
            "BANK_TRANSFER" &&
            selectedPaymentMethod.accountName && (
              <p
                className="
                  mt-3
                  text-xs
                  text-neutral-500
                "
              >
                Account Name:{" "}
                {selectedPaymentMethod.accountName}
              </p>
            )}

          {selectedPaymentMethod.type ===
            "WISE" &&
            selectedPaymentMethod.wiseName && (
              <p
                className="
                  mt-3
                  text-xs
                  text-neutral-500
                "
              >
                Account Name:{" "}
                {selectedPaymentMethod.wiseName}
              </p>
            )}
        </div>
      )}

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
            px-5
            py-4
            text-sm
            leading-6
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* ==================================================== */}
      {/* CONTINUE */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() => {
          void handleContinue();
        }}
        disabled={
          loading ||
          submitting ||
          paymentMethods.length === 0 ||
          !selectedPaymentMethodId
        }
        className="
          mt-6
          inline-flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-full
          bg-black
          px-6
          py-4
          text-[11px]
          font-medium
          uppercase
          tracking-[0.3em]
          text-white
          transition
          hover:bg-[#C8A96A]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {submitting && (
          <Loader2
            className="
              h-4
              w-4
              animate-spin
            "
          />
        )}

        {submitting
          ? "Setting Payment Method..."
          : "Continue to Payment"}
      </button>

    </div>
  );
}
