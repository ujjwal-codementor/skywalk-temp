import { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ 
  children, 
  title = 'Furnish Care',
  description = 'Professional furniture care and maintenance subscription service. Keep your furniture looking beautiful with our expert touch-up services.'
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
}


// import { ReactNode } from 'react';
// import Head from 'next/head';
// import Header from './Header';
// import Footer from './Footer';
// import { GoogleAnalytics } from '@next/third-parties/google'; 

// interface LayoutProps {
//   children: ReactNode;
//   title?: string;
//   description?: string;
// }

// export default function Layout({ 
//   children, 
//   title = 'Furnish Care',
//   description = 'Professional furniture care and maintenance subscription service. Keep your furniture looking beautiful with our expert touch-up services.'
// }: LayoutProps) {
//   return (
//     <>
//       <Head>
//         <title>{title}</title>
//         <meta name="description" content={description} />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
      
//       <GoogleAnalytics gaId="G-6457DDM6RL" /> 

//       <div className="min-h-screen flex flex-col">
//         <Header />
        
//         <main className="flex-1">
//           {children}
//         </main>
        
//         <Footer />
//       </div>
//     </>
//   );
// }


