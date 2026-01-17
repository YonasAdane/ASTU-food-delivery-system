'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, User, Store } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Order } from '@/types/order';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
  en_route: 'bg-orange-100 text-orange-800',
};

export function OrderTableRow({
  order,
  onUpdate,
  onView,
}: {
  order: Order;
  onUpdate: (id: string, status: string) => void;
  onView: (order: Order) => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-mono font-bold">
        #{order._id.slice(0, 8).toUpperCase()}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{order.customerId.name}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-muted-foreground" />
          <span>{order.restaurantId.name}</span>
        </div>
      </TableCell>

      <TableCell>${order.total.toFixed(2)}</TableCell>

      <TableCell>
        <Badge className={statusColors[order.status]}>
          {order.status.replace('_', ' ')}
        </Badge>
      </TableCell>

      <TableCell>
        {new Date(order.createdAt).toLocaleDateString()}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(order)}>
              Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdate(order._id, 'delivered')}>
              Mark Delivered
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
