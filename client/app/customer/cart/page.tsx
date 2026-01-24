"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import Link from "next/link";
import { MapPin, ShoppingBag } from "lucide-react";

// Components
import { CartHeader } from "@/components/cart/CartHeader";
import { CartItems } from "@/components/cart/CartItems";
import { DeliveryInput } from "@/components/cart/DeliveryInput";
import { OrderSummary } from "@/components/cart/OrderSummary";
const LocationPicker = dynamic(
  () => import("@/components/cart/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-75 bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">
        Loading Map...
      </div>
    ),
  },
);
const API_URL = "http://localhost:5000";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // State for Inputs
  const [locationText, setLocationText] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    number[] | null
  >(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const { setCount } = useCartStore();

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/customer/getCart`, {
        withCredentials: true,
      });
      setCart(res.data.data);
      setCount(res.data.data?.items?.length || 0);
    } catch (err: any) {
      setCart(null);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateCart = async (itemId: string, newQty: number) => {
    setUpdatingId(itemId);
    try {
      await axios.put(
        `${API_URL}/customer/updateCart/${itemId}`,
        { quantity: newQty },
        { withCredentials: true },
      );
      await fetchCart();
    } catch (error) {
      toast.error("Failed to update item");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingId(itemId);
    try {
      await axios.delete(`${API_URL}/customer/removeFromCart/${itemId}`, {
        withCredentials: true,
      });
      await fetchCart();
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!cart?.restaurantId) return;
    setUpdatingId("clear");
    try {
      await axios.delete(
        `${API_URL}/customer/deleteCart/${cart.restaurantId._id || cart.restaurantId}`,
        { withCredentials: true },
      );
      setCart(null);
      setCount(0);
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedCoordinates) {
      toast.error("Please select a Campus Zone from the dropdown");
      return;
    }
    if (!locationText.trim()) {
      toast.error("Please enter specific location details (e.g. Room number)");
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Sending data matching your backend Schema
      // Schema requires 'deliveryLocation' as GeoJSON Point
      // We also send 'addressText' if your backend logic handles it (or put it in feedback/notes)
      const payload = {
        deliveryLocation: {
          type: "Point",
          coordinates: selectedCoordinates, // [lng, lat] from the dropdown
        },
        paymentMethod: paymentMethod === "telebirr" ? "mobile_banking" : "cash",
        // IMPORTANT: Sending the detailed text. Ensure your backend saves this!
        // If your schema strictly only has what you showed, you might need to save this in 'feedback'
        // or add a 'deliveryAddress' string field to your Schema.
        feedback: locationText, // Temporary workaround if you don't have an address string field
      };

      const res = await axios.post(`${API_URL}/orders`, payload, {
        withCredentials: true,
      });

      toast.success("Order placed successfully!");
      setCart(null);
      setCount(0);
      router.push(`/customer/orders`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!cart || !cart.items || cart.items.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <CartHeader
          restaurantName={cart.restaurantId?.name}
          isClearing={updatingId === "clear"}
          onClear={handleClearCart}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CartItems
              items={cart.items}
              updatingId={updatingId}
              onUpdate={handleUpdateCart}
              onRemove={handleRemoveItem}
            />
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600">
                  <MapPin size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Delivery Location
                </h2>
              </div>

              {/* THE MAP */}
              <div className="mb-4">
                <LocationPicker
                  onLocationSelect={(coords) => setSelectedCoordinates(coords)}
                />
              </div>

              {/* Detail Input */}
              <textarea
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Specific details (e.g. Block 42, Room 305)..."
                className="w-full p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={cart.total}
              deliveryFee={20}
              paymentMethod={paymentMethod}
              isPlacingOrder={isPlacingOrder}
              onPaymentChange={setPaymentMethod}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-950">
      <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <ShoppingBag size={40} className="text-orange-500" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
        Your cart is empty
      </h2>
      <Link
        href="/customer/restaurant"
        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold"
      >
        Browse Restaurants
      </Link>
    </div>
  );
}
