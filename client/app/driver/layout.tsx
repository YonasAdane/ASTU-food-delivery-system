"use client";
import DriverLocationTracker from "@/components/drivers/DriverLocationTracker";
import { useUserStore } from "@/hooks/use-profile";
import DriverNavBar from "@/components/drivers/DriverNavbar";
import { ModeToggle } from "@/components/common/modeToggle";
import ProfileDropdown from "@/components/users/profileDropdown";


const generateAvatar = (name?: string, email?: string) => {
  const displayName = name || email || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=6366f1&color=fff`;
};

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((state) => state.user);
  const driverId = user?._id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      
      {driverId && <DriverLocationTracker driverId={driverId} />}
      <DriverNavBar />

      <main className="md:pl-64 pb-24 transition-all duration-300 min-h-screen">
        
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 relative">
           
           <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-row items-center gap-3 z-10">
            <ModeToggle />
            <ProfileDropdown
              avatar={generateAvatar(user?.firstName, user?.email)}
              email={user?.email}
              phone={user?.phone}
              role={user?.role}
              createdAt={user?.createdAt}
            />
          </div>

          {children}
          
        </div>
        
      </main>
    </div>
  );
}