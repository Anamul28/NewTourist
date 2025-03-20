export interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  rating: number;
  reviews: Review[];
  category: string;
  admission_fee?: string;
  opening_hours?: string;
  website?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}