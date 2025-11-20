import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isSignedIn } = useUser();
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  useEffect(() => {
    // Always show header on all pages
    setIsVisible(true);
    
    if (!isHomePage) {
      return;
    }
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolled = currentScrollY > 50;
      
      setIsScrolled(scrolled);
      setLastScrollY(currentScrollY);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <header 
      className={`${
        isHomePage 
          ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled
                ? "bg-white shadow-md border-b border-gray-200"
                : "bg-black/40 backdrop-blur-md shadow-sm border-b border-white/10"
            } ${
              isHomePage && !isVisible ? "-translate-y-full" : "translate-y-0"
            }`
          : "bg-white shadow-sm border-b border-gray-200"
      }`}
    >
      <div className="container-width section-padding">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
  <Link href="/" className="flex items-center">
    {/* <Image
      src="/Logo.png"            // <-- replace with your logo path
      alt="FurnishCare Logo"
      width={40}
      height={40}
      className="rounded-lg"     // optional styling
    /> */}
    <span className={`ml-2 text-3xl font-semibold playfair-display ${
      isHomePage && !isScrolled ? "text-white" : "text-gray-900"
    }`}>
      Furnish Care
    </span>
  </Link>
</div>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              href="/"
              className={`font-sans font-medium transition-colors ${
                isHomePage && !isScrolled
                  ? "text-white/90 hover:text-white" 
                  : "text-gray-700 hover:text-primary-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`font-sans font-medium transition-colors ${
                isHomePage && !isScrolled
                  ? "text-white/90 hover:text-white" 
                  : "text-gray-700 hover:text-primary-600"
              }`}
            >
              Pricing
            </Link>

            <Link
              href="/blogs"
              className={`font-sans font-medium transition-colors ${
                isHomePage && !isScrolled
                  ? "text-white/90 hover:text-white" 
                  : "text-gray-700 hover:text-primary-600"
              }`}
            >
              Blogs
            </Link>
            

            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`font-sans font-medium transition-colors ${
                    isHomePage && !isScrolled
                      ? "text-white/90 hover:text-white" 
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/user/progress"
                  className={`font-sans font-medium transition-colors ${
                    isHomePage && !isScrolled
                      ? "text-white/90 hover:text-white" 
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  Progress
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                
                <Link href="/sign-in">
                  <button className={`font-sans font-medium transition-colors ${
                    isHomePage && !isScrolled
                      ? "text-white/90 hover:text-white" 
                      : "text-gray-700 hover:text-primary-600"
                  }`}>
                    Login
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className={`font-sans px-4 py-2 rounded transition-colors ${
                    isHomePage && !isScrolled
                      ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                      : "bg-primary-600 hover:bg-primary-700 text-white"
                  }`}>
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`hover:text-primary-600 focus:outline-none focus:text-primary-600 transition-colors ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-700"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden border-t pt-4 pb-3 space-y-1 ${
            isHomePage && !isScrolled ? "border-white/20" : "border-gray-200"
          }`}>
            <Link
              href="/"
              className={`block px-3 py-2 hover:text-primary-600 font-sans font-medium transition-colors ${
                isHomePage && !isScrolled ? "text-white/90" : "text-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`block px-3 py-2 hover:text-primary-600 font-sans font-medium transition-colors ${
                isHomePage && !isScrolled ? "text-white/90" : "text-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>

            <Link
              href="/blogs"
              className={`block px-3 py-2 hover:text-primary-600 font-sans font-medium transition-colors ${
                isHomePage && !isScrolled ? "text-white/90" : "text-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blogs
            </Link>


            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 hover:text-primary-600 font-sans font-medium transition-colors ${
                    isHomePage && !isScrolled ? "text-white/90" : "text-gray-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/user/progress"
                  className={`block px-3 py-2 hover:text-primary-600 font-sans font-medium transition-colors ${
                    isHomePage && !isScrolled ? "text-white/90" : "text-gray-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Progress
                </Link>
                <div className="px-3 py-2">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <div className="px-3 py-2">
                  <Link href="/sign-in">
                    <button className={`w-full text-left hover:text-primary-600 font-sans font-medium transition-colors ${
                      isHomePage && !isScrolled ? "text-white/90" : "text-gray-700"
                    }`}>
                      Login
                    </button>
                  </Link>
                </div>
                <div className="px-3 py-2">
                  <Link href="/sign-up">
                    <button className={`w-full text-left font-sans font-medium transition-colors ${
                      isHomePage && !isScrolled
                        ? "text-white/90 hover:text-white"
                        : "text-primary-600 hover:text-primary-700"
                    }`}>
                      Sign Up
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
