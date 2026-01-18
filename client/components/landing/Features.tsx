import React from 'react';
import { User, Store, Bike, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'For Students & Staff',
    description: 'Browse menus, place orders, and track delivery to your exact location within ASTU.',
    icon: User,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Campus Vendors',
    description: 'Manage digital menus, process incoming orders efficiently, and reduce counter congestion.',
    icon: Store,
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    title: 'Delivery Personnel',
    description: 'Receive delivery requests with optimized routes and share live location with customers.',
    icon: Bike,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'University Admin',
    description: 'Oversee operations, approve vendors, and ensure food safety compliance across campus.',
    icon: ShieldCheck,
    color: 'bg-purple-500/10 text-purple-500',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            A Unified Ecosystem for ASTU
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Connecting every stakeholder in the university to ensure a seamless dining experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 bg-slate-950 border border-slate-800 rounded-2xl hover:border-orange-500/30 transition-all hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;