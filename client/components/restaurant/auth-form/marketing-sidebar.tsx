export default function MarketingSidebar() {
  return (
    <section className=" relative flex w-full lg:w-[50%] flex-col justify-center overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 p-8 lg:p-16 text-white">
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
            Bring Your Restaurant Online in Minutes
          </h1>
          <p className="mt-6 max-w-md text-white/80">
            Join thousands of local restaurants growing their business with
            FoodiePartner.
          </p>
        </div>

        <ul className="space-y-4">
          {[
            {
              title: "Expand Your Growth",
              desc: "Increase your monthly sales by up to 40%",
            },
            {
              title: "Increase Your Reach",
              desc: "Connect with over 100,000 customers",
            },
            {
              title: "Secure Payments",
              desc: "Automated weekly payouts",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur"
            >
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-white/70">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
