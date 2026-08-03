import PageHeader from "../_components/PageHeader";
import Card from "../_components/Card";
import EmptyState from "../_components/EmptyState";
import Button from "../_components/Button";

export default function OrdersPage() {
  return (
    <main className="space-y-8">

      <PageHeader
        title="Orders"
        description="Manage customer orders."
      >
        <Button>
          + Create Order
        </Button>
      </PageHeader>

      <Card>

        <EmptyState
          title="No Orders"
          description="Orders will appear here once customers place their orders."
        />

      </Card>

    </main>
  );
}