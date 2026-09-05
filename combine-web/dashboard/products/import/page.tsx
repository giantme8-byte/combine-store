import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/authorize";

import PageHeader from "../../_components/PageHeader";
import Card from "../../_components/Card";
import ImportUploader from "./_components/ImportUploader";

export default async function ImportProductsPage() {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);

  return (
    <main className="space-y-8">
      <PageHeader
        title="Import Products"
        description="Import products from an Excel (.xlsx) file."
      />

      <Card className="space-y-6 p-8">
        <ImportUploader />

        <div className="rounded-lg bg-gray-50 p-4 text-sm">
          <h3 className="font-semibold">
            Supported Format
          </h3>

          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>.xlsx files only</li>
            <li>Maximum file size: 10 MB</li>
            <li>Exported COMBINE template recommended</li>
          </ul>
        </div>
      </Card>
    </main>
  );
}