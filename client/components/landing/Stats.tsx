import React from 'react';

const Stats = () => {
  return (
    <section className="py-20 border-y border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-1">15+</div>
            <div className="text-slate-500 text-sm uppercase tracking-wider">Campus Vendors</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">20m</div>
            <div className="text-slate-500 text-sm uppercase tracking-wider">Avg. Delivery Time</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">5k+</div>
            <div className="text-slate-500 text-sm uppercase tracking-wider">Students Served</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">100%</div>
            <div className="text-slate-500 text-sm uppercase tracking-wider">Digital Payments</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;