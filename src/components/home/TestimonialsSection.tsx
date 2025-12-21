import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Placeholder image URLs - replace with actual images
const placeholderImages = {
  richard: "https://i.ibb.co.com/MyKFRdNP/lawyer-4.jpg",
  olivia: "https://i.ibb.co.com/jZvGmbv6/lawyer-3.jpg",
  pedro: "https://i.ibb.co.com/9HmBM6CH/lawyer-2.jpg",
};

const testimonials = [
  {
    id: 1,
    name: 'Richard Sanchez',
    rating: 5,
    quote:
      '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco"',
    image: placeholderImages.richard,
    positionClasses: 'top-0 right-4 lg:right-20 z-20',
  },
  {
    id: 2,
    name: 'Olivia Wilson',
    rating: 4,
    quote:
      '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud"',
    image: placeholderImages.olivia,
    positionClasses: 'top-64 left-0 lg:left-10 z-10',
  },
  {
    id: 3,
    name: 'Pedro Fernandes',
    rating: 4.5,
    quote:
      '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud"',
    image: placeholderImages.pedro,
    positionClasses: 'top-[32rem] right-0 lg:right-4 z-30',
  },
];

const TestimonialCard = ({
  name,
  rating,
  quote,
  image,
  positionClasses,
}: {
  name: string;
  rating: number;
  quote: string;
  image: string;
  positionClasses: string;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={`absolute w-full max-w-md bg-white p-8 pt-12 rounded-3xl shadow-2xl ${positionClasses}`}>
      <div className="absolute -top-10 left-8 p-1 bg-white rounded-full">
        <Image
          src={image}
          alt={name}
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      <div className="ml-24 mb-4">
        <h4 className="text-xl font-bold text-slate-900">{name}</h4>
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              fill={i < fullStars ? 'currentColor' : i === fullStars && hasHalfStar ? 'url(#half)' : 'none'}
              className={i < fullStars ? 'text-yellow-500' : 'text-slate-300'}
            />
          ))}
           <svg width="0" height="0">
            <defs>
                <linearGradient id="half" x1="0" x2="100%" y1="0" y2="0">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#cbd5e1" /> {/* slate-300 */}
                </linearGradient>
            </defs>
        </svg>
        </div>
      </div>
      <p className="text-slate-600 italic leading-relaxed">{quote}</p>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-[#0a1128]">
      {/* Geometric Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-900/30 to-transparent transform rotate-12"></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-blue-950/50 to-transparent transform -skew-x-12"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-blue-900/20 to-transparent transform skew-y-6"></div>
      </div>

      <div className="container relative mx-auto px-6 z-10 flex flex-col lg:flex-row items-center">
        {/* Left Content */}
        <div className="lg:w-2/5 mb-16 lg:mb-0 text-white">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Client
            <br />
            Testimonial
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Button className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-6 text-lg rounded-full">
            Read More
          </Button>
        </div>

        {/* Right Content - Testimonial Cards */}
        <div className="lg:w-3/5 relative h-[800px] w-full">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;