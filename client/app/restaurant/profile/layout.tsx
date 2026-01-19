import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ASTU Food - Partner Portal',
  description: 'Manage your restaurant profile, branding, and operating details',
}

export default function RestaurantProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
