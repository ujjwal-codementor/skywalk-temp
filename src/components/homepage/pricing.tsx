import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/router";

const plans = [
  {
    name: "Basic",
    price: "19.99",
    description: "1 Scheduled service visit per year.",
    features: [
      'Annual furniture touch-up service',
      'Covers up to 3 pieces of furniture',
      '$100 per additional piece',
      'Includes damage assessment',
      'Ideal for light home usage with minimal wear'
    ],
  },
  {
    name: "Standard",
    price: "29.99",
    description: "Up to 2 scheduled service visits per year.",
    features: [
      'Bi-annual furniture touch-up service',
      'Covers up to 5 pieces of furniture',
      '$100 per additional piece',
      'Ideal for moderate use households'
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "49.99",
    description: "Up to 2 scheduled service visits per year.",
    features: [
      'Bi-annual furniture touch-up service',
      'Covers up to 8 pieces of furniture',
      '$100 per additional piece',
      'Ideal for High-use furniture and busy households',
    ],
  },

  // {
  //   name: "Enterprise",
  //   price: "149.99",
  //   description: "Complete care for multiple furniture pieces",
  //   features: [
  //     "5 furniture pieces per month",
  //     "All repair types included",
  //     "Priority 24-hour scheduling",
  //     "On-site service",
  //     "Satisfaction guarantee",
  //     "Free care kit",
  //   ],
  // },
];

const Pricing = () => {
  const router = useRouter();
  return (
    <section id="pricing" className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-sans font-semibold text-black mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-black font-sans">
            Flexible subscription plans designed to keep your furniture beautiful
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`fade-in-up bg-white rounded-sm p-8 border-2 transition-all duration-500 hover:shadow-xl ${
                plan.highlighted
                  ? "border-secondary-500 md:scale-105 shadow-lg"
                  : "border-gray-200"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-sans font-semibold text-black mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-black font-sans">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-sans font-semibold text-black">
                    ${plan.price}
                  </span>
                  <span className="text-black ml-2 font-sans">/month</span>
                </div>
              </div>
              
              <Button
                className="w-full mb-8 bg-secondary-500 hover:bg-secondary-600 text-black font-sans font-semibold"
                onClick={() => router.push('/pricing')}
              >
                Get Started
              </Button>
              
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-sm text-black font-sans">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
