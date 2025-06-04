import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    content:
      "I was nervous about my tech interview, but after practicing with GiveMeThatJob, I felt so much more confident. The AI asked me the exact type of questions I got in my real interview. I got the job!",
    author: "Sarah Johnson",
    role: "Software Engineer at Google",
  },
  {
    content:
      "The feedback I received was incredibly detailed. It pointed out speech patterns I wasn't aware of and helped me refine my answers. Worth every penny.",
    author: "Mark Thompson",
    role: "Product Manager at Microsoft",
  },
  {
    content:
      "As someone with interview anxiety, this tool was a game-changer. Being able to practice with an AI that feels so real helped me overcome my nervousness.",
    author: "Jessica Chen",
    role: "Marketing Director at Adobe",
  },
  {
    content:
      "Our HR team uses the Team plan to pre-screen candidates and help them prepare. It's improved our hiring process and candidate experience dramatically.",
    author: "Robert Garcia",
    role: "Head of Talent at Spotify",
  },
];

export function Testimonials() {
  return (
    <div id="testimonials" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hear from our successful users
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <p className="text-foreground">"{testimonial.content}"</p>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}