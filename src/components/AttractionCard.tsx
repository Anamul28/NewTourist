import React from 'react';
import { Phone, Mail, Wifi, PawPrint, Ban } from 'lucide-react';
import { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
}

export function AttractionCard({ attraction }: AttractionCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-emerald-600">
      <img
        src={attraction.image}
        alt={attraction.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <div className="uppercase text-sm font-semibold text-gray-500 mb-2">
          {attraction.category}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          {attraction.name}
        </h2>
        
        <div className="text-gray-600 mb-4">
          {attraction.location.address}, {attraction.location.city}, {attraction.location.state}
        </div>

        <div className="text-2xl font-bold text-blue-500 mb-6">
          {attraction.admission_fee || 'Free Admission'}
        </div>

        <p className="text-gray-600 mb-6">
          {attraction.description}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <Wifi className="w-5 h-5 text-blue-500" />
          <PawPrint className="w-5 h-5 text-blue-500" />
          <Ban className="w-5 h-5 text-red-500" />
        </div>

        <div className="space-y-4">
          {attraction.opening_hours && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{attraction.opening_hours}</span>
            </div>
          )}
          
          {attraction.website && (
            <a
              href={attraction.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              VIEW OUR WEBSITE
            </a>
          )}
          
          <button className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors">
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
}