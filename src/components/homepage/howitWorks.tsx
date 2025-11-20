const craftsmanImage = "/craftsman-work.jpg";
import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Subscribe",
    description: "Choose your plan based on your furniture type and household needs.",
  },
  {
    number: "02",
    title: "Wait & Protect",
    description: "Enjoy your furniture knowing you have Furnish Care while you wait for your first service.",
  },
  {
    number: "03",
    title: "Schedule & Shine",
    description: "Schedule your service when convenient. Our professionals will restore your furniture to like-new condition with expert care.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={craftsmanImage}
                alt="Professional craftsman restoring furniture"
                className="w-full h-auto md:h-[600px] object-cover rounded-sm shadow-xl"
                width={1000}
                height={1000} 
              />
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-6"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-elegant-gray mb-12"
            >
              Simple, professional, and hassle-free furniture care in three easy steps.
            </motion.p>
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.15,
                    type: "spring",
                    stiffness: 120,
                    damping: 14
                  }}
                  whileHover={{
                    x: 8,
                    transition: { duration: 0.2 }
                  }}
                  className="flex gap-6 cursor-pointer group"
                >
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + index * 0.15,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="text-5xl font-display font-light text-soft-taupe group-hover:text-primary transition-colors duration-300">
                      {step.number}
                    </span>
                  </motion.div>
                  <div className="pt-2">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.15 }}
                      className="text-2xl font-display font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300"
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.15 }}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {step.description}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
