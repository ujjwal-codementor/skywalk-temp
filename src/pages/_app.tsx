import "@/styles/globals.css"
import {ClerkProvider} from "@clerk/nextjs"
import type {AppProps} from "next/app"
import Script from "next/script"
import {useRouter} from "next/router"
import {useEffect} from "react"
import GoogleAnalytics from "@/components/GoogleAnalytics"
// import {GoogleAnalytics, usePageViews} from "nextjs-google-analytics";

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter()
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-37K35LHHEN"




  return (
    <>

      <GoogleAnalytics/>

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

