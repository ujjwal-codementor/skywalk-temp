


import { Check, CreditCard, FileSignature, User, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useGetApi } from "@/lib/apiCallerClient"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"

type StepStatus = "completed" | "current" | "upcoming"

interface Step {
  id: number
  title: string
  description: string
  icon: any
  status: StepStatus
  link: string
}

export default function TimelinePage() {
  const router = useRouter()
  const [plan, setPlan] = useState("")
  const [loading, setLoading] = useState(true) // ✅ loader state
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "User Information & Billing",
      description: "Provide your personal details and billing information",
      icon: User,
      status: "upcoming",
      link: "/user/form",
    },
    {
      id: 2,
      title: "Purchase Subscription",
      description: "Complete your subscription purchase with secure payment",
      icon: CreditCard,
      status: "upcoming",
      link: "/user/buy-now",
    },
    // {
    //   id: 3,
    //   title: "Book Appointment",
    //   description: "Enjoy your time with Furnish Care",
    //   icon: CreditCard,
    //   status: "upcoming",
    //   link: "/dashboard",
    // },
  ])

  const getApi = useGetApi()
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await getApi(`${BACKEND_URL}/api/progress/get`)
        const data = await res.data
        const currentStep = data.currentStep
        setPlan(data.subscriptionType)

        setSteps((prev) =>
          prev.map((step) => {
            if (step.id < currentStep) {
              return { ...step, status: "completed" }
            }
            if (step.id === currentStep) {
              return { ...step, status: "current" }
            }
            return { ...step, status: "upcoming" }
          })
        )
      } catch (error) {
        console.error("Failed to fetch step status:", error)
        router.push("/pricing")
      } finally {
        setTimeout(() => setLoading(false), 2000) // ✅ stop loader when done
      }
    }

    fetchStatus()
  }, [])

  if (loading) {
    // ✅ Skeleton Loader
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 w-72 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          </div>

          {/* Steps Skeleton */}
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="relative flex items-start mb-12 last:mb-0">
              {/* Circle */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 bg-gray-200 border-gray-300 animate-pulse"></div>

              {/* Content */}
              <div className="ml-8 flex-1">
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                  <div className="h-6 w-48 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 w-72 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ✅ Actual Content
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Service Setup Progress for <span className="text-primary-700">{plan}</span> plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to complete your furniture touch-up subscription setup
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>

          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = step.status === "completed"
            const isCurrent = step.status === "current"

            return (
              <div key={step.id} className="relative flex items-start mb-12 last:mb-0">
                {/* Icon container */}
                <div
                  className={`
                    relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4
                    ${
                      isCompleted
                        ? "bg-primary-900 border-primary-900 text-white"
                        : isCurrent
                        ? "bg-secondary-500 border-secondary-500 text-white animate-pulse"
                        : "bg-gray-200 border-gray-300 text-gray-500"
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>

                {/* Content */}
                <div className="ml-8 flex-1">
                  <div
                    className={`
                      bg-white rounded-lg border p-6 shadow-sm
                      ${isCurrent ? "ring-2 ring-secondary-400 shadow-md" : ""}
                    `}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className={`
                          text-xl font-semibold
                          ${
                            isCompleted
                              ? "text-primary-600"
                              : isCurrent
                              ? "text-secondary-600"
                              : "text-gray-500"
                          }
                        `}
                      >
                        Step {step.id}: {step.title}
                      </h3>
                      <span
                        className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${
                            isCompleted
                              ? "bg-primary-100 text-primary-600"
                              : isCurrent
                              ? "bg-secondary-100 text-secondary-700"
                              : "bg-gray-200 text-gray-500"
                          }
                        `}
                      >
                        {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Upcoming"}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>

                    {isCurrent && (
                      <div className="mt-4 pt-4 border-t">
                        <Link href={step.link}>
                          <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
                            Continue Step
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold text-primary-700 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to assist you through every step of the process.
          </p>
          <button className="bg-primary-900 hover:bg-primary-900 text-white px-6 py-2 rounded-md font-medium transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

