import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_TRACKING_ID) return;

    const sendPageView = () => {
      if (typeof window !== "undefined" && window.gtag) {
        if (process.env.NODE_ENV === 'development') {
          console.log("📊 Sending page_view for:", pathname);
        }
        
        // Send page view event (this generates collect request)
        window.gtag("event", "page_view", {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      } else {
        // Retry after a short delay
        setTimeout(sendPageView, 500);
      }
    };

    // Wait a bit for gtag to be initialized, then send page view
    setTimeout(sendPageView, 1000);
  }, [pathname]);

  if (!GA_TRACKING_ID) {
    console.warn("⚠️ NEXT_PUBLIC_GA_ID not found");
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            send_page_view: false
          });

          ${process.env.NODE_ENV === 'development' ? "console.log('✅ GA initialized with ID: ${GA_TRACKING_ID}');" : ''}
          
          // Send initial page view after initialization
          setTimeout(() => {
            gtag('event', 'page_view', {
              page_path: window.location.pathname,
              page_location: window.location.href,
              page_title: document.title,
            });
            ${process.env.NODE_ENV === 'development' ? "console.log('📊 Initial page view sent');" : ''}
          }, 500);
        `}
      </Script>
    </>
  );
}