import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <body
	className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 font-display min-h-screen flex flex-col">

	{/* <!-- Main Content --> */}
	<main className="flex-1 flex justify-center items-center py-10 px-4 md:px-10">
		<div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
			{/* <!-- Left Side: Hero Image/Content --> */}
			<div className="hidden lg:flex flex-col justify-center h-full gap-6">
				<div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-xl group">
					<div className="absolute inset-0 bg-black/40 z-10"></div>
					<div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
						<h1 className="text-white text-4xl font-bold leading-tight mb-2">Taste the best of campus.</h1>
						<p className="text-white/90 text-lg">Join thousands of students ordering from local favorites.</p>
						<div className="mt-6 flex gap-3">
							<span
								className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/10">Fast
								Delivery</span>
							<span
								className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/10">Student
								Discounts</span>
						</div>
					</div>
					<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
						data-alt="Delicious pizza with melted cheese and basil on a wooden table"
						style={{backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCAOdN0O1TLNbED8DVJiHBFfXL0HaEpVYnjltdYfn-1FkNOqzQ69-St2IF8xvkcBNEy8K7bxU9fJhyC4XzT6l69venJYmf_O9-Lobq0VNHYVHegxRmHgKjOHw0fGsKfw0mgPl4_KSnr89fAZNNV1lb8MKdqnLuVsyqqdfLNT_eHCwPpJUgVwpb-rsWM6mztVsB7YLky-sajU-Y2YaH_C97bJ2E5WW81zlTB-gP-aZ-wgUoWHL8h6KX-r8SOFv3R3QuVBgzhcVn6OVs)"}}>
					</div>
				</div>
			</div>
			{/* <!-- Right Side: Registration Form --> */}
			 {/* Right Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Start ordering delicious meals today
          </p>

          <RegisterForm />
        </div>
      </div>
		</div>
	</main>
	{/* <!-- Simple Footer --> */}
	{/* <footer className="py-6 px-10 border-t border-[#eaf3e7] dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
		<p className="text-xs text-slate-400">© 2023 ASTU Food Delivery System. All rights reserved.</p>
	</footer> */}
</body>
  )
}
