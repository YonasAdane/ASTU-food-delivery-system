const roles = [
  {
    title: "Students & Staff",
    description: "Browse live menus from campus vendors, place orders, and track your food in real-time.",
    icon: "🎓"
  },
  {
    title: "Cafeteria Vendors",
    description: "Digitize your menu, manage incoming orders, and optimize your kitchen workflow.",
    icon: "🍳"
  },
  {
    title: "Delivery Personnel",
    description: "Earn while moving across campus. Get optimized routes and live location updates.",
    icon: "🚲"
  }
];

export default function UserRoles() {
  return (
    <section className="py-20 px-6 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <div key={index} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors group">
              <div className="text-4xl mb-4">{role.icon}</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors">{role.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}