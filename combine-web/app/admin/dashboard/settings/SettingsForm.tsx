"use client";

import {
  useState,
} from "react";

import LogoUpload from "@/components/LogoUpload";


// ============================================================
// TYPES
// ============================================================

type Settings = {
  companyName: string | null;

  companyLogo: string | null;

  companyDescription: string | null;

  whatsappNumber: string | null;

  phone: string | null;

  email: string | null;

  website: string | null;

  address: string | null;

  exchangeRate: number;

  facebook: string | null;

  instagram: string | null;

  tiktok: string | null;

  youtube: string | null;

  siteTitle: string | null;

  metaDescription: string | null;

  maintenanceMode: boolean;
};


type SettingsFormProps = {
  settings: Settings | null;

  action: (
    formData: FormData
  ) => void | Promise<void>;
};


// ============================================================
// COMPONENT
// ============================================================

export default function SettingsForm({
  settings,
  action,
}: SettingsFormProps) {

  const [
    companyLogo,
    setCompanyLogo,
  ] = useState(
    settings?.companyLogo ?? ""
  );


  return (

    <form
      action={action}
      className="
        space-y-6
        sm:space-y-8
      "
    >

      {/* ======================================================
          COMPANY
          ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          sm:p-8
        "
      >

        <div
          className="
            mb-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-neutral-900
            "
          >
            Company
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Basic company information.
          </p>

        </div>


        {/* ====================================================
            LOGO
            ==================================================== */}

        <input
          type="hidden"
          name="companyLogo"
          value={companyLogo}
        />


        <LogoUpload
          value={
            companyLogo
          }
          onChange={
            setCompanyLogo
          }
        />


        {/* ====================================================
            COMPANY INFORMATION
            ==================================================== */}

        <div
          className="
            mt-6
            space-y-6
          "
        >

          {/* COMPANY NAME */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="companyName"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Company Name
            </label>

            <input
              id="companyName"
              name="companyName"
              defaultValue={
                settings?.companyName ??
                ""
              }
              placeholder="COMBINE"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>


          {/* COMPANY DESCRIPTION */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="companyDescription"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Company Description
            </label>

            <textarea
              id="companyDescription"
              name="companyDescription"
              defaultValue={
                settings?.companyDescription ??
                ""
              }
              rows={4}
              placeholder="Luxury Bags & Accessories"
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                leading-6
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          CONTACT
          ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          sm:p-8
        "
      >

        <div
          className="
            mb-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-neutral-900
            "
          >
            Contact
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Contact information displayed on your website.
          </p>

        </div>


        <div
          className="
            space-y-6
          "
        >

          {/* WHATSAPP */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="whatsappNumber"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              WhatsApp Number
            </label>

            <input
              id="whatsappNumber"
              name="whatsappNumber"
              defaultValue={
                settings?.whatsappNumber ??
                ""
              }
              placeholder="60166620448"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>


          {/* PHONE */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="phone"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              defaultValue={
                settings?.phone ??
                ""
              }
              placeholder="+60 12-345 6789"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>


          {/* EMAIL */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="email"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              defaultValue={
                settings?.email ??
                ""
              }
              placeholder="hello@combine.com"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>


          {/* WEBSITE */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="website"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Website
            </label>

            <input
              id="website"
              name="website"
              defaultValue={
                settings?.website ??
                ""
              }
              placeholder="https://combine.com"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>


          {/* ADDRESS */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="address"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Address
            </label>

            <textarea
              id="address"
              name="address"
              defaultValue={
                settings?.address ??
                ""
              }
              rows={3}
              placeholder="Miri, Sarawak, Malaysia"
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                leading-6
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          BUSINESS
          ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          sm:p-8
        "
      >

        <div
          className="
            mb-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-neutral-900
            "
          >
            Business
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Business configuration.
          </p>

        </div>


        <div
          className="
            space-y-6
          "
        >

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="exchangeRate"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Exchange Rate (CNY → MYR)
            </label>

            <input
              id="exchangeRate"
              name="exchangeRate"
              type="number"
              step="0.01"
              defaultValue={
                settings?.exchangeRate
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          SOCIAL MEDIA
          ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          sm:p-8
        "
      >

        <div
          className="
            mb-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-neutral-900
            "
          >
            Social Media
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Social media links displayed on your website.
          </p>

        </div>


        <div
          className="
            space-y-6
          "
        >

          {/* FACEBOOK */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="facebook"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Facebook
            </label>

            <input
              id="facebook"
              name="facebook"
              type="url"
              defaultValue={
                settings?.facebook ??
                ""
              }
              placeholder="https://facebook.com/yourpage"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>


          {/* INSTAGRAM */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="instagram"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Instagram
            </label>

            <input
              id="instagram"
              name="instagram"
              type="url"
              defaultValue={
                settings?.instagram ??
                ""
              }
              placeholder="https://instagram.com/youraccount"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>


          {/* TIKTOK */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="tiktok"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              TikTok
            </label>

            <input
              id="tiktok"
              name="tiktok"
              type="url"
              defaultValue={
                settings?.tiktok ??
                ""
              }
              placeholder="https://tiktok.com/@youraccount"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>


          {/* YOUTUBE */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="youtube"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              YouTube
            </label>

            <input
              id="youtube"
              name="youtube"
              type="url"
              defaultValue={
                settings?.youtube ??
                ""
              }
              placeholder="https://youtube.com/@yourchannel"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          SEO
          ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          sm:p-8
        "
      >

        <div
          className="
            mb-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-neutral-900
            "
          >
            SEO
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Search engine metadata for your website.
          </p>

        </div>


        <div
          className="
            space-y-6
          "
        >

          {/* SITE TITLE */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="siteTitle"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Site Title
            </label>

            <input
              id="siteTitle"
              name="siteTitle"
              type="text"
              defaultValue={
                settings?.siteTitle ??
                ""
              }
              placeholder="COMBINE | Luxury Bags, Watches & Jewelry"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>


          {/* META DESCRIPTION */}

          <div
            className="
              space-y-2
            "
          >

            <label
              htmlFor="metaDescription"
              className="
                block
                text-sm
                font-medium
                text-neutral-900
              "
            >
              Meta Description
            </label>

            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={4}
              defaultValue={
                settings?.metaDescription ??
                ""
              }
              placeholder="Discover premium luxury handbags, designer watches, fine jewellery and timeless accessories at COMBINE."
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                leading-6
                outline-none
                transition
                focus:border-neutral-400
                focus:ring-2
                focus:ring-black/5
              "
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          SYSTEM
          ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          sm:p-8
        "
      >

        <div
          className="
            mb-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-neutral-900
            "
          >
            System
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Control system-level website settings.
          </p>

        </div>


        {/* ====================================================
            MAINTENANCE MODE
            ==================================================== */}

        <label
          htmlFor="maintenanceMode"
          className="
            flex
            cursor-pointer
            items-start
            gap-4
            rounded-xl
            border
            border-neutral-200
            p-4
            transition
            hover:bg-neutral-50
          "
        >

          <input
            id="maintenanceMode"
            name="maintenanceMode"
            type="checkbox"
            defaultChecked={
              settings?.maintenanceMode ??
              false
            }
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
              rounded
              accent-black
            "
          />

          <span>

            <span
              className="
                block
                text-sm
                font-semibold
                text-neutral-900
              "
            >
              Maintenance Mode
            </span>

            <span
              className="
                mt-1
                block
                text-sm
                leading-6
                text-neutral-500
              "
            >
              Temporarily disable customer access
              while you perform maintenance or
              system updates.
            </span>

          </span>

        </label>

      </section>


      {/* ======================================================
          SAVE
          ====================================================== */}

      <button
        type="submit"
        className="
          w-full
          rounded-xl
          bg-black
          py-3.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-neutral-800
          sm:py-4
        "
      >
        Save Settings
      </button>

    </form>

  );

}