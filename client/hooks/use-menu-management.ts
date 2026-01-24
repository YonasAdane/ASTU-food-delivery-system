"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= API ================= */
import {
  fetchMyRestaurant,
  toggleMenuAvailability,
  deleteMenuItem,
  updateMenuItem,
  createMenuItem,
} from "@/lib/menu-management.api";

/* ================= TYPES ================= */
import type { MenuItem, Restaurant } from "@/types/menu-management.types";

export function useMenuManagement() {
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    async function load() {
      try {
        const restaurantData = await fetchMyRestaurant();
        setRestaurant(restaurantData);
        setMenu(restaurantData.menu || []);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  /* ================= TOGGLE ================= */
  async function toggleAvailability(item: MenuItem) {
    if (!restaurant || !item._id) return;

    await toggleMenuAvailability(restaurant._id, item);

    setMenu(prev =>
      prev.map(m =>
        m._id === item._id
          ? { ...m, inStock: !m.inStock }
          : m
      )
    );
  }

  /* ================= DELETE ================= */
  async function removeItem(id: string) {
    if (!restaurant) return;
    if (!confirm("Delete this item?")) return;

    await deleteMenuItem(restaurant._id, id);
    setMenu(prev => prev.filter(m => m._id !== id));
  }

  /* ================= SAVE ================= */
  async function saveItem() {
    if (!restaurant || !editing) return;

    if (editing._id) {
      await updateMenuItem(restaurant._id, editing);
      setMenu(prev =>
        prev.map(m =>
          m._id === editing._id ? editing : m
        )
      );
    } else {
      const newItem = await createMenuItem(
        restaurant._id,
        editing
      );
      setMenu(prev => [...prev, newItem]);
    }

    setOpenModal(false);
    setEditing(null);
  }

  return {
    restaurant,
    menu,
    loading,

    openModal,
    editing,

    setOpenModal,
    setEditing,

    toggleAvailability,
    removeItem,
    saveItem,
  };
}
