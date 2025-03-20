import React from 'react';
import { Code2, Sparkles, DollarSign, Cloud, Users, HelpCircle } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Code2 className="w-8 h-8 text-blue-500" />,
    title: "Built for developers",
    description: "Built for engineers, developers, dreamers, thinkers and doers."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-purple-500" />,
    title: "Ease of use",
    description: "It's as easy as using an Apple, and as expensive as buying one."
  },
  {
    icon: <DollarSign className="w-8 h-8 text-green-500" />,
    title: "Pricing like no other",
    description: "Our prices are best in the market. No cap, no lock, no credit card required."
  },
  {
    icon: <Cloud className="w-8 h-8 text-sky-500" />,
    title: "100% Uptime guarantee",
    description: "We just cannot be taken down by anyone."
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-500" />,
    title: "Multi-tenant Architecture",
    description: "You can simply share passwords instead of buying new seats"
  },
  {
    icon: <HelpCircle className="w-8 h-8 text-rose-500" />,
    title: "24/7 Customer Support",
    description: "We are available a 100% of the time. At least our AI Agents are."
  }
];

export function FeatureCards() {
  return (
    <div className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-gray-700 rounded-lg p-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              </div>
              <p className="mt-4 text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}