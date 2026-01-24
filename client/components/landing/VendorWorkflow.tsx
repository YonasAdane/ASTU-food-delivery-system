import React from 'react';
import { ChefHat, BellRing, ClipboardCheck, Bike } from 'lucide-react';

const steps = [
  {
    title: "Manage Your Menu",
    description: "Easily update food availability, prices, and daily specials through the vendor dashboard. Mark items as 'Sold Out' instantly to avoid confusion.",
    icon: ChefHat,
  },
  {
    title: "Receive Orders Instantly",
    description: "Get real-time notifications when a student places an order. View detailed order slips with special instructions and delivery locations.",
    icon: BellRing,
  },
  {
    title: "Process & Prepare",
    description: "Track order status from 'Pending' to 'Cooking' to 'Ready'. The system organizes your kitchen workflow to reduce waiting times.",
    icon: ClipboardCheck,
  },
  {
    title: "Assign Delivery",
    description: "Hand off the meal to university-approved delivery personnel. The system automatically updates the student that their food is on the way.",
    icon: Bike,
  },
];

const VendorWorkflow = () => {
  return (
    <section id="vendors" className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#fb923c 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-orange-500 font-semibold tracking-wide uppercase text-sm mb-2">For Cafeterias & Lounges</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Streamline Your Kitchen Operations
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            The ASTU system isn't just for ordering—it's a complete management tool for campus vendors to handle high-volume hours efficiently.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 group">
                {/* Card Container */}
                <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-full hover:border-orange-500/50 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-900/10">
                  {/* Icon Circle */}
                  <div className="w-14 h-14 mx-auto bg-slate-200 dark:bg-slate-900 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:border-orange-500 transition-colors shadow-lg">
                    <step.icon className="h-6 w-6 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors" />
                  </div>

                  {/* Text Content */}
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-3">
                    {step.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Vendor Dashboard Preview (Static Visual) */}
        <div className="mt-16 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl p-2 border border-slate-200/50 dark:border-slate-700/50 max-w-5xl mx-auto backdrop-blur-sm">
          <div className="bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative aspect-16/7">
            {/* Fake Dashboard UI */}
            <div className="absolute inset-0 flex flex-col">
              {/* Fake Header */}
              <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-900 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">Vendor Dashboard - Admin Panel</div>
              </div>
              {/* Fake Body */}
              <div className="flex-1 flex">
                {/* Sidebar */}
                <div className="w-48 border-r border-slate-200 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-900/50 hidden md:block p-4 space-y-3">
                  <div className="h-2 w-20 bg-slate-300 dark:bg-slate-700 rounded"></div>
                  <div className="h-2 w-28 bg-slate-300 dark:bg-slate-800 rounded"></div>
                  <div className="h-2 w-24 bg-slate-300 dark:bg-slate-800 rounded"></div>
                  <div className="h-2 w-20 bg-slate-300 dark:bg-slate-800 rounded"></div>
                </div>
                {/* Main Area */}
                <div className="flex-1 p-6 grid grid-cols-3 gap-4">
                  {/* Card 1 */}
                  <div className="bg-slate-200 dark:bg-slate-900 rounded-lg p-4 border border-slate-300 dark:border-slate-800">
                    <div className="text-orange-500 text-xs mb-2">Active Orders</div>
                    <div className="text-slate-900 dark:text-white text-2xl font-bold">12</div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-slate-200 dark:bg-slate-900 rounded-lg p-4 border border-slate-300 dark:border-slate-800">
                    <div className="text-blue-500 text-xs mb-2">Revenue Today</div>
                    <div className="text-slate-900 dark:text-white text-2xl font-bold">ETB 4,500</div>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-slate-200 dark:bg-slate-900 rounded-lg p-4 border border-slate-300 dark:border-slate-800">
                    <div className="text-green-500 text-xs mb-2">Pending Delivery</div>
                    <div className="text-slate-900 dark:text-white text-2xl font-bold">3</div>
                  </div>
                  {/* List */}
                  <div className="col-span-3 bg-slate-200 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 h-full mt-2 p-4 space-y-3 opacity-50">
                    <div className="h-2 w-full bg-slate-300 dark:bg-slate-700 rounded"></div>
                    <div className="h-2 w-full bg-slate-300 dark:bg-slate-700 rounded"></div>
                    <div className="h-2 w-2/3 bg-slate-300 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-[1px]">
              <p className="text-white font-mono text-lg border border-white/20 px-4 py-2 rounded bg-black/30 dark:bg-black/50">
                Vendor Dashboard Interface
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VendorWorkflow;
