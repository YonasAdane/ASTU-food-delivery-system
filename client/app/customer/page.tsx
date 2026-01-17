'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const CustomerPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.push('/customer/restaurant')
    }, [router])

    return null
}

export default CustomerPage