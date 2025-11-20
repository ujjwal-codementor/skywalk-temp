import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
const diningRoomImage = "/dining-room.jpg";
import Image from "next/image";

const CTA = () => {
  const router = useRouter();
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={diningRoomImage}
          alt="Beautiful restored dining room"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-primary-900/90" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center fade-in-up">
          <h2 className="text-4xl md:text-6xl font-display font-semibold text-white mb-6">
            Ready to Protect Your Furniture?
          </h2>
          <p className="text-lg md:text-xl text-white/85 mb-10 leading-relaxed font-sans">
          Join thousands of satisfied customers who trust Furnish Care with their furniture maintenance needs.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/pricing')}
            className="group bg-secondary-400 hover:bg-secondary-500/90 text-black font-sans font-bld text-lg px-8"
          >
            View  Plans
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
