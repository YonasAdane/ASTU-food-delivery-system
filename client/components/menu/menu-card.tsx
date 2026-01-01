// @/components/menu/menu-card.tsx
"use client";

import { useTransition } from "react";
import { MenuItemDetail } from "@/lib/validations/menu";
import { updateMenuItem, deleteMenuItem } from "@/actions/menu-actions";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export function MenuCard({ item }: { item: MenuItemDetail }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const res = await updateMenuItem(item._id!, { inStock: checked });
      if (!res.success) toast.error(res.message);
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      const res = await deleteMenuItem(item._id!);
      if (res.success) toast.success("Deleted");
      else toast.error(res.message);
    });
  };

  return (
    <div className={`group flex flex-col bg-card rounded-2xl border transition-all ${!item.inStock && 'opacity-60'}`}>
      <div className="h-48 w-full bg-cover bg-center relative rounded-t-2xl" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded font-bold text-sm">${item.price}</div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Switch checked={item.inStock} onCheckedChange={handleToggle} disabled={isPending} />
            <span className="text-xs font-bold">{item.inStock ? "Available" : "Sold Out"}</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}