import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/router";
const heroImage = "/hero-furniture.jpg"

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          className="w-full h-full object-cover"
          alt="Elegant furniture in modern living room"
          width={1920}
          height={1080}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/85 to-blue-700/80" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10 py-12">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-2 leading-tight">
            Furnish Care
          </h1>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
            Professional furniture care service
          </h2>

          <div className="inline-block bg-secondary-500 rounded-lg px-8 py-3 mb-6">
            <p className="text-lg md:text-2xl font-bold text-black font-sans">
              Protect your furniture starting from $19.99/month
            </p>
          </div>

          <p className="text-base md:text-lg text-white mb-8 leading-relaxed max-w-3xl mx-auto font-sans">
            Professional furniture care subscription service. Protect your investment 
            with regular touch-ups, deep polishing, and expert maintenance.
          </p>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-secondary-500 hover:bg-secondary-600 text-black text-lg font-bold px-8 py-6 font-sans rounded-lg"
              onClick={() => router.push('/pricing')}
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
