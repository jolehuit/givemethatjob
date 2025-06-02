import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "I was nervous about my tech interview, but after practicing with GiveMeThatJob, I felt so much more confident. The AI asked me the exact type of questions I got in my real interview. I got the job!",
    author: "Sarah Johnson",
    role: "Software Engineer at Google",
    rating: 5,
  },
  {
    content:
      "The feedback I received was incredibly detailed. It pointed out speech patterns I wasn't aware of and helped me refine my answers. Worth every penny.",
    author: "Mark Thompson",
    role: "Product Manager at Microsoft",
    rating: 5,
  },
  {
    content:
      "As someone with interview anxiety, this tool was a game-changer. Being able to practice with an AI that feels so real helped me overcome my nervousness.",
    author: "Jessica Chen",
    role: "Marketing Director at Adobe",
    rating: 5,
  },
  {
    content:
      "Our HR team uses the Team plan to pre-screen candidates and help them prepare. It's improved our hiring process and candidate experience dramatically.",
    author: "Robert Garcia",
    role: "Head of Talent at Spotify",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Testimonials() {
  return (
    <div id="testimonials" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hear from our successful users
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-foreground text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="mt-6 border-t border-border pt-4">
                    <div className="flex items-center gap-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.author}
                        </p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}