import "@/styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import type { AppProps } from "next/app"
import Script from "next/script"
import { useRouter } from "next/router"
import { useEffect } from "react"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-6457DDM6RL"

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "page_view", {
          page_path: url,
          page_location: window.location.href,
          page_title: document.title,
          debug_mode: process.env.NODE_ENV === "development",
        })
      }
    }

    router.events.on("routeChangeComplete", handleRouteChange)
    if (typeof window !== "undefined") {
      handleRouteChange(window.location.pathname)
    }
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events, GA_MEASUREMENT_ID])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
      `}</Script>

      <ClerkProvider
        {...pageProps}
        appearance={{
          cssLayerName: "clerk",
        }}
      >
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  )
}

export default MyApp

