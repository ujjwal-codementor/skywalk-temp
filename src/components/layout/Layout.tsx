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
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <title>{title}</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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



