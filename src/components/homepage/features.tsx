import { Sparkles, Shield, Clock, Home, UserRoundCheck, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "Peace of Mind",
    description: "Secure your investment from unexpected damage.",
  },
  {
    icon: Shield,
    title: "Preserved Aesthetics",
    description: "Professional maintenance keeps your furniture looking beautiful year-round.",
  },
  {
    icon: Clock,
    title: "Cost Savings",
    description: "Regular maintenance extends furniture life and prevents costly replacements.",
  },
  {
    icon: Home,
    title: "Convenience",
    description: "We come to you, working at your schedule to minimize disruption to your home life.",
  },
  {
    icon: TrendingUp,
    title: "Longevity",
    description: "Regular professional care extends the life of your furniture, protecting your investment..",
  },
  {
    icon: UserRoundCheck,
    title: "Expert Care",
    description: "Our trained professionals use premium products and proven techniques.",
  },
];

const Features = () => {
  return (
    <section className="py-24 md:py-32 bg-warm-cream overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-4">
            Why Choose Furnish Care?
          </h2>
          <p className="text-lg text-elegant-gray">
            Professional care that protects your investment and keeps your furniture pristine
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 12
              }}
              whileHover={{ 
                scale: 1.03,
                y: -5,
                transition: { duration: 0.3 }
              }}
              className="bg-card p-8 rounded-sm hover:shadow-xl transition-shadow duration-500 border border-border cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1 + 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <feature.icon className="w-12 h-12 text-primary mb-6" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
