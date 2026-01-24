
const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-xl text-slate-900 dark:text-white">
              ASTU<span className="text-orange-500">Eats</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Adama Science and Technology University
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors">Terms</a>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors">Support</a>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-900 pt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} ASTU Food Delivery System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
