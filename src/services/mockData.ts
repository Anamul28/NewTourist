import { Attraction } from '../types';

export const mockAttractions: Attraction[] = [
  {
    id: '1',
    name: 'Statue of Liberty',
    description: 'Iconic symbol of freedom and democracy, standing tall in New York Harbor.',
    image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&q=80&w=800',
    location: {
      lat: 40.6892,
      lng: -74.0445,
      address: 'Liberty Island',
      city: 'New York City',
      state: 'NY'
    },
    rating: 4.8,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        comment: 'An incredible experience! A must-visit landmark.',
        date: '2024-02-20T10:00:00Z'
      }
    ],
    category: 'Landmarks'
  },
  {
    id: '2',
    name: 'Golden Gate Bridge',
    description: 'Iconic suspension bridge spanning the Golden Gate strait.',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800',
    location: {
      lat: 37.8199,
      lng: -122.4783,
      address: 'Golden Gate Bridge',
      city: 'San Francisco',
      state: 'CA'
    },
    rating: 4.9,
    reviews: [
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 5,
        comment: 'Beautiful bridge with stunning views of the bay.',
        date: '2024-02-19T15:30:00Z'
      }
    ],
    category: 'Landmarks'
  }
];

export async function fetchAttractions(): Promise<Attraction[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockAttractions;
}