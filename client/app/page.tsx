import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import VendorWorkflow from '@/components/landing/VendorWorkflow';
import Stats from '@/components/landing/Stats';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-200 selection:bg-orange-500 selection:text-white">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <VendorWorkflow />

      {/* Call to Action */}
      <section className="py-24 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to streamline campus dining?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            Whether you are a hungry student or a busy cafeteria manager, ASTU Eats makes it easier.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
