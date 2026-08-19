import { Resend } from "resend";


// ============================================================
// RESEND
// ============================================================

const resend = new Resend(
  process.env.RESEND_API_KEY
);


// ============================================================
// EMAIL CONFIG
// ============================================================

const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  "COMBINE <onboarding@resend.dev>";


// ============================================================
// ADMIN EMAIL
// ============================================================

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL;


// ============================================================
// SEND EMAIL
// ============================================================

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {

  if (
    !process.env.RESEND_API_KEY
  ) {

    throw new Error(
      "RESEND_API_KEY is not configured."
    );

  }


  const result =
    await resend.emails.send({

      from:
        EMAIL_FROM,

      to: [
        to,
      ],

      subject,

      html,

    });


  if (
    result.error
  ) {

    console.error(
      "Resend email error:",
      result.error
    );


    throw new Error(
      result.error.message
    );

  }


  return result.data;

}


// ============================================================
// SEND ADMIN EMAIL
// ============================================================

export async function sendAdminEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {

  if (!ADMIN_EMAIL) {

    throw new Error(
      "ADMIN_EMAIL is not configured."
    );

  }


  return sendEmail({

    to:
      ADMIN_EMAIL,

    subject,

    html,

  });

}