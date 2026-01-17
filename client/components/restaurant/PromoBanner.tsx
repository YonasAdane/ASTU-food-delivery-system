export default function PromoBanner() {
  return (
    <div className="h-40 md:h-52 rounded-2xl bg-linear-to-r from-orange-400 to-primary text-white p-8">
      <span className="text-xs font-bold">DAILY SPECIAL</span>
      <h2 className="text-3xl font-bold mt-2">50% OFF All Pizzas</h2>
      <p className="text-sm mt-2 max-w-md">
        Get half price on all pizzas until 4 PM.
      </p>
      <button className="mt-4 bg-white text-primary px-6 py-2 rounded-full font-bold">
        Order Now
      </button>
    </div>
  )
}
