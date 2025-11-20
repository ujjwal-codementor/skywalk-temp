import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black/85 text-white/75 font-sans">
      <div className="container-width section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              
              <span className=" text-xl font-semibold text-white playfair-display">
                Furnish Care
              </span>
            </div>
            <p className="text-soft-taupe mb-4">
              Professional furniture care and maintenance service. 
              Keep your furniture looking beautiful with our expert touch-up services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-soft-taupe hover:text-white font-sans transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-soft-taupe hover:text-white font-sans transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white font-sans">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-soft-taupe hover:text-white font-sans transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-soft-taupe hover:text-white font-sans transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-soft-taupe hover:text-white font-sans transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-soft-taupe hover:text-white font-sans transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white font-sans">
              Need Help
            </h3>
            <ul className="space-y-2">
              {/* <li>
                <Link href="/user/t&c" className="text-soft-taupe hover:text-white font-sans transition-colors">
                  Privacy Policy
                </Link>
              </li> */}
              {/* <li>
                <Link href="/user/t&c" className="text-soft-taupe hover:text-white font-sans transition-colors">
                  Terms of Service
                </Link>
              </li> */}
              <li>
                <Link href="/" className="text-soft-taupe hover:text-white font-sans transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-soft-taupe text-sm">
              © {new Date().getFullYear()} Furnish Care. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              {/* <p className="text-soft-taupe text-sm">
                Made with ❤️ for beautiful furniture
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}