import { getAdminOrders } from '@/actions/order-actions';
import OrdersClient from './orders-client';
import { Order } from '@/types/order';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    hasComplaints?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
	const sp=await searchParams;
  const page = Number(sp.page ?? 1);

  const filters = {
    search: sp.search ?? '',
    status: sp.status ?? '',
    hasComplaints: sp.hasComplaints ?? '',
  };

  const res = await getAdminOrders({
    page,
    limit: 10,
    ...filters,
  });

  const orders: Order[] = res?.data?.data ?? [];
  const meta = res?.data?.meta ?? { total: 0, pages: 1 };

  return (
    <OrdersClient
      orders={orders}
      meta={meta}
      filters={filters}
      page={page}
    />
  );
}
