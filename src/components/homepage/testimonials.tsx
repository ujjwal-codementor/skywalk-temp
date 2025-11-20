import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Homeowner',
    content: 'The Furnish Care service has been amazing! My leather sofa looks brand new after their touch-up service. The team was professional and the results exceeded my expectations.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Interior Designer',
    content: 'I recommend this service to all my clients. Professional, reliable, and the results are outstanding. It\'s become an essential part of maintaining beautiful homes.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Pet Owner',
    content: 'With two cats, my furniture takes a beating. This service keeps everything looking perfect between deep cleans. Worth every penny!',
    rating: 5
  },
  {
    name: 'David Thompson',
    role: 'Real Estate Professional',
    content: 'Regular maintenance has significantly extended the life of my furniture. The convenience and quality of service is unmatched.',
    rating: 5
  },
  {
    name: 'Lisa Anderson',
    role: 'Busy Parent',
    content: 'As a parent with young kids, furniture care was always on my mind. Furnish Care takes that worry away. Highly recommend!',
    rating: 5
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Auto-rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02] overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-900 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-900 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-sans font-semibold text-black mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-black font-sans">
            Trusted by homeowners, designers, and families who value quality furniture care
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative h-[400px] md:h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="absolute inset-0"
              >
                <div className="bg-white border border-gray-200 rounded-sm p-8 md:p-10 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Quote className="w-10 h-10 text-black mb-6" strokeWidth={1} />
                  
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-secondary-500 fill-secondary-500"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl text-black mb-8 flex-grow leading-relaxed italic font-sans">
                    "{testimonials[currentIndex].content}"
                  </p>

                  <div className="border-t border-gray-200 pt-6">
                    <p className="font-sans font-semibold text-black text-lg">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-black text-sm mt-1 font-sans">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-300 ${
                  index === currentIndex ? 'w-8' : 'w-2'
                } h-2 rounded-full ${
                  index === currentIndex
                    ? 'bg-secondary-500'
                    : 'bg-gray-300 hover:bg-secondary-500/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute inset-0 rounded-full bg-secondary-500"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Additional testimonials grid (visible on larger screens) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:grid grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-sm p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-secondary-500 fill-secondary-500"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="text-sm text-black mb-4 line-clamp-4 italic font-sans">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-sans font-semibold text-black text-sm">
                  {testimonial.name}
                </p>
                <p className="text-black text-xs mt-1 font-sans">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

