import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import VendorWorkflow from '@/components/landing/VendorWorkflow'; // Changed import
import Stats from '@/components/landing/Stats';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-orange-500 selection:text-white">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <VendorWorkflow />
      
      {/* Call to Action */}
      <section className="py-24 bg-linear-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to streamline campus dining?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Whether you are a hungry student or a busy cafeteria manager, ASTU Eats makes it easier.
          </p>
          <div className="flex justify-center gap-4">
             <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-900/50">
               Get Started
             </button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}