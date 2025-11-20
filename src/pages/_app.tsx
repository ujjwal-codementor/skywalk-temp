import "@/styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import type { AppProps } from "next/app"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import Head from "next/head"
import MetaPixel from "@/components/metaPixel"
  
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Global <Head> — applies favicon to all pages */}
      <Head>
        <link rel="icon" href="/Logo.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta
          name="keywords"
          content="furniture touch up Dallas, furniture polish Dallas, furniture repair Dallas, wood furniture restoration Dallas, furniture maintenance subscription, furniture service plan, wood scratch repair, veneer repair, wood polishing, home furniture care, monthly furniture service, subscription furniture repair, Dallas Texas, DFW"
        />
      </Head>
      <GoogleAnalytics />
      <MetaPixel />
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
