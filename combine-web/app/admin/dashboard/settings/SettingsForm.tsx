"use client";

import { useState } from "react";
import LogoUpload from "@/components/LogoUpload";

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

  action: (formData: FormData) => void | Promise<void>;
};

export default function SettingsForm({
  settings,
  action,
}: SettingsFormProps) {
    const [companyLogo, setCompanyLogo] = useState(
  settings?.companyLogo ?? ""
);

  return (
<form
  action={action}
  className="space-y-8"
>
  <input
    type="hidden"
    name="companyLogo"
    value={companyLogo}
  />

  <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
    <div className="mb-6">
      <h2 className="text-xl font-semibold">
        Company
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Basic company information.
      </p>
    </div>

<LogoUpload
  value={companyLogo}
  onChange={setCompanyLogo}
/>

<div className="mt-6 space-y-6">
  <div className="space-y-2">
    <label className="block font-medium">
      Company Name
    </label>

    <input
      name="companyName"
      defaultValue={settings?.companyName ?? ""}
      placeholder="COMBINE"
      className="w-full rounded-lg border p-3"
    />
  </div>

  <div className="space-y-2">
    <label className="block font-medium">
      Company Description
    </label>

    <textarea
      name="companyDescription"
      defaultValue={settings?.companyDescription ?? ""}
      rows={4}
      placeholder="Luxury Bags & Accessories"
      className="w-full rounded-lg border p-3"
    />
  </div>
</div>
  </section>
  <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
  <div className="mb-6">
    <h2 className="text-xl font-semibold">
      Contact
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Contact information displayed on your website.
    </p>
  </div>

  <div className="space-y-6">
    <div className="space-y-2">
      <label className="block font-medium">
        WhatsApp Number
      </label>

      <input
        name="whatsappNumber"
        defaultValue={settings?.whatsappNumber ?? ""}
        placeholder="60166620448"
        className="w-full rounded-lg border p-3"
      />
    </div>

    <div className="space-y-2">
      <label className="block font-medium">
        Phone
      </label>

      <input
        name="phone"
        defaultValue={settings?.phone ?? ""}
        placeholder="+60 12-345 6789"
        className="w-full rounded-lg border p-3"
      />
    </div>

    <div className="space-y-2">
      <label className="block font-medium">
        Email
      </label>

      <input
        type="email"
        name="email"
        defaultValue={settings?.email ?? ""}
        placeholder="hello@combine.com"
        className="w-full rounded-lg border p-3"
      />
    </div>

    <div className="space-y-2">
      <label className="block font-medium">
        Website
      </label>

      <input
        name="website"
        defaultValue={settings?.website ?? ""}
        placeholder="https://combine.com"
        className="w-full rounded-lg border p-3"
      />
    </div>

    <div className="space-y-2">
      <label className="block font-medium">
        Address
      </label>

      <textarea
        name="address"
        defaultValue={settings?.address ?? ""}
        rows={3}
        placeholder="Miri, Sarawak, Malaysia"
        className="w-full rounded-lg border p-3"
      />
    </div>
  </div>
</section>

<section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
  <div className="mb-6">
    <h2 className="text-xl font-semibold">
      Business
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Business configuration.
    </p>
  </div>

  <div className="space-y-6">
    <div className="space-y-2">
      <label className="block font-medium">
        Exchange Rate (CNY → MYR)
      </label>

      <input
        name="exchangeRate"
        type="number"
        step="0.01"
        defaultValue={settings?.exchangeRate}
        className="w-full rounded-lg border p-3"
      />
    </div>
  </div>
</section>

{/* SEO */}
<section className="space-y-6 rounded-2xl border p-6">
  <h2 className="text-xl font-semibold">
    SEO
  </h2>

  <div className="space-y-6">
    <div className="space-y-2">
      <label className="block font-medium">
        Site Title
      </label>

      <input
        name="siteTitle"
        type="text"
        defaultValue={settings?.siteTitle ?? ""}
        placeholder="COMBINE | Luxury Bags, Watches & Jewelry"
        className="w-full rounded-lg border p-3"
      />
    </div>

    <div className="space-y-2">
      <label className="block font-medium">
        Meta Description
      </label>

      <textarea
        name="metaDescription"
        rows={4}
        defaultValue={settings?.metaDescription ?? ""}
        placeholder="Discover premium luxury handbags, designer watches, fine jewellery and timeless accessories at COMBINE."
        className="w-full rounded-lg border p-3"
      />
    </div>
  </div>
</section>

<button
  type="submit"
  className="w-full rounded-lg bg-black py-4 font-semibold text-white transition hover:bg-neutral-800"
>
  Save Settings
</button>
</form>
  );
}