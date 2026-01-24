"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { 
  Loader2, Phone, MessageSquare, Star, Send 
} from "lucide-react";

// Dynamic Import for Map
const LiveTrackingMap = dynamic(() => import('@/components/orders/LiveTrackingMap'), { 
  ssr: false,
  loading: () => <div className="h-100 w-full bg-slate-100 rounded-3xl animate-pulse" />
});


export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Feedback States
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, { withCredentials: true });
      setOrder(res.data.data);
      // If feedback exists, pre-fill it
      if (res.data.data.rating) {
        setRating(res.data.data.rating);
        setComment(res.data.data.feedback || "");
      }
    } catch (error) {
      console.error("Error fetching order", error);
      toast.error("Could not load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmittingFeedback(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/feedback`, {
        rating,
        comment
      }, { withCredentials: true });
      
      toast.success("Feedback submitted successfully!");
      // Refresh order to show the 'read-only' view
      fetchOrder(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;
  if (!order) return <div>Order not found</div>;

  // Coordinate parsing (Same as before)
  const customerCoords: [number, number] = [
    order.deliveryLocation.coordinates[1], 
    order.deliveryLocation.coordinates[0]
  ];
  const restaurantCoords: [number, number] = order.restaurantId?.location 
    ? [order.restaurantId.location.coordinates[1], order.restaurantId.location.coordinates[0]] 
    : [9.0320, 38.7423];

  const isDelivered = order.status === 'delivered';
  const hasRated = !!order.rating;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Track Order</h1>
          <p className="text-slate-500">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Map & Details */}
          <div className="lg:col-span-2 space-y-6">
            <LiveTrackingMap 
              customerLocation={customerCoords}
              restaurantLocation={restaurantCoords}
              driverId={order.driverId?._id} 
            />

            {/* ORDER ITEMS */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4">Order Details</h3>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item._id} className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-bold">{item.price} ETB</span>
                  </div>
                ))}
                <div className="pt-4 mt-4 border-t border-dashed">
                  <div className="flex justify-between font-black text-xl">
                    <span>Total</span>
                    <span className="text-orange-600">{order.total} ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FEEDBACK SECTION (Shows only when Delivered) */}
            {isDelivered && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Star className="fill-orange-500 text-orange-500" size={24} />
                  {hasRated ? "Your Review" : "Rate your experience"}
                </h3>
                
                {!hasRated ? (
                  /* --- WRITE FEEDBACK MODE --- */
                  <div className="space-y-4">
                    <p className="text-slate-500 text-sm">How was the food and delivery?</p>
                    
                    {/* Star Input */}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star 
                            size={32} 
                            className={`${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts (optional)..."
                      className="w-full p-4 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none resize-none h-24"
                    />

                    <button
                      onClick={handleSubmitFeedback}
                      disabled={submittingFeedback || rating === 0}
                      className="px-6 py-3 bg-slate-900 dark:bg-orange-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50"
                    >
                      {submittingFeedback ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                      Submit Feedback
                    </button>
                  </div>
                ) : (
                  /* --- READ ONLY MODE (Already Rated) --- */
                  <div className="space-y-3 mt-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={24} 
                          className={`${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    {comment && (
                      <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl text-slate-600 dark:text-slate-300 italic">
                        "{comment}"
                      </div>
                    )}
                    <div className="text-xs font-bold text-green-600 flex items-center gap-1 mt-2">
                      Thanks for your feedback!
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Status & Driver */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Current Status</div>
              <div className="text-2xl font-black text-orange-600 capitalize mb-4">
                {order.status.replace("_", " ")}
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full bg-orange-500 transition-all duration-1000 ${getProgressWidth(order.status)}`} />
              </div>
            </div>

            {/* Driver Card Logic (Same as before) */}
            {order.driverId ? (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800">
                <h3 className="font-bold text-lg mb-4">Your Driver</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xl">
                    {order.driverId.name[0]}
                  </div>
                  <div>
                    <div className="font-bold">{order.driverId.name}</div>
                    <div className="text-sm text-slate-500">Volvo FH16 • 4.8 ★</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600">
                    <Phone size={18} /> Call
                  </button>
                  <button className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200">
                    <MessageSquare size={18} /> Chat
                  </button>
                </div>
              </div>
            ) : (
              !isDelivered && (
                <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 text-yellow-800 text-center">
                  <Loader2 className="animate-spin mx-auto mb-2" />
                  <span className="font-bold">Finding a driver...</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getProgressWidth(status: string) {
  switch (status) {
    case 'pending': return 'w-[10%]';
    case 'accepted': return 'w-[25%]';
    case 'preparing': return 'w-[50%]';
    case 'ready': return 'w-[75%]';
    case 'picked': return 'w-[85%]';
    case 'en_route': return 'w-[90%]';
    case 'delivered': return 'w-[100%]';
    case 'canceled': return 'w-[100%] bg-red-500'; // Handle canceled visual
    default: return 'w-[0%]';
  }
}