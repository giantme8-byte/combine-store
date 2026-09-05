import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/authorize";

import WebsiteAnalytics from "../_components/WebsiteAnalytics";

import { PageHeader } from "@/components/ui/page-header";

export default async function AnalyticsPage() {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);

  return (
    <main className="space-y-8">

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <PageHeader
        title="Analytics"
        description="Monitor your website traffic, visitor activity, and product performance."
      />

      {/* ================================================= */}
      {/* Website Analytics */}
      {/* ================================================= */}

      <WebsiteAnalytics />

    </main>
  );
}