import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";

import { saveSettings } from "./_actions/settings.actions";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);

  const settings = await prisma.setting.findFirst();

  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
          COMBINE
        </p>

        <h1 className="mt-2 text-4xl font-light">
          Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your store configuration.
        </p>
      </div>

<SettingsForm
  settings={settings}
  action={saveSettings}
/>
    </main>
  );
}