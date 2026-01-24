import { Metadata } from "next";
import MarketingSidebar from "@/components/restaurant/auth-form/marketing-sidebar";
import RegisterForm from "@/components/restaurant/auth-form/restaurant-register-form";

export const metadata: Metadata = {
  title: "Restaurant Partner Registration | FoodiePartner",
};

export default function RestaurantRegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh)] flex-col lg:flex-row">
      <MarketingSidebar />
      <section className=" flex w-full lg:w-[60%] items-center justify-center bg-background-light dark:bg-background-dark ">
        <RegisterForm />
      </section>
    </main>
  );
}
