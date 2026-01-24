import React from "react";
import { ArrowRight, MapPin, Play } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-24 bg-slate-50 dark:bg-slate-950 min-h-[90vh] flex items-center">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-1/2 h-full z-0 pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-96 h-96 bg-orange-600/20 dark:bg-orange-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/10 dark:bg-blue-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT SIDE: VIDEO SECTION */}
          <div className="order-2 lg:order-1 relative w-full">
            <div className="absolute -inset-1 bg-linear-to-tr from-orange-600 to-slate-800 dark:from-orange-500 dark:to-slate-900 rounded-2xl blur opacity-30"></div>

            <div className="relative bg-slate-900 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-800 dark:border-slate-700 shadow-2xl aspect-video group">
              <video
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                key="hero-video"
                poster="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
              >
                <source
                  src="/7706003-uhd_4096_2160_25fps.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="w-full h-full flex items-center justify-center bg-slate-950 dark:bg-slate-900 cursor-pointer relative">
                <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-800/30 group-hover:bg-slate-900/20 dark:group-hover:bg-slate-700/20 transition-all z-10"></div>

                <div className="z-20 text-center transform transition-transform group-hover:scale-110 duration-300">
                  <div className="w-20 h-20 bg-orange-600/90 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 pl-1 shadow-lg shadow-orange-900/50">
                    <Play className="h-8 w-8 text-white fill-white" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    System Demo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CONTENT SECTION */}
          <div className="order-1 lg:order-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 text-orange-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Live at Adama Science & Tech University
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white">
              Campus Dining, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
                Digitized.
              </span>
            </h1>

            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              The ASTU Food Delivery System connects students directly with
              campus cafeterias. Skip the queues, track your meal, and focus on
              your studies while we handle the logistics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/login"
                className="inline-flex justify-center items-center px-6 py-3 text-base font-semibold rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-900/40"
              >
                Order Food Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
  
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-950 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400"
                  >
                    U{i}
                  </div>
                ))}
              </div>
              <p>Trusted by ASTU Students & Staff</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
