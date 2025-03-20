import { supabase } from '../lib/supabase';
import { Attraction, Review } from '../types';

// READ operations
export async function fetchAttractions(): Promise<Attraction[]> {
  try {
    // Fetch from Supabase directly since we can't use Google Places API in the browser
    const { data: attractions, error: queryError } = await supabase
      .from('attractions')
      .select(`
        *,
        reviews (*)
      `);

    if (queryError) {
      console.error('Error fetching attractions:', queryError);
      throw queryError;
    }

    if (!attractions || attractions.length === 0) {
      console.warn('No attractions found in the database');
      return [];
    }

    return attractions.map((attraction: any) => ({
      id: attraction.id,
      name: attraction.name,
      description: attraction.description,
      image: attraction.image,
      location: {
        lat: attraction.latitude,
        lng: attraction.longitude,
        address: attraction.address,
        city: attraction.city,
        state: attraction.state
      },
      rating: attraction.rating,
      reviews: (attraction.reviews || []).map((review: any) => ({
        id: review.id,
        userId: review.user_id,
        userName: 'Anonymous',
        rating: review.rating,
        comment: review.comment,
        date: review.created_at
      })),
      category: attraction.category,
      admission_fee: attraction.admission_fee,
      opening_hours: attraction.opening_hours,
      website: attraction.website
    }));
  } catch (error) {
    console.error('Error fetching attractions:', error);
    throw error;
  }
}

// CREATE operations
export async function createAttraction(attraction: Omit<Attraction, 'id' | 'reviews'>): Promise<Attraction> {
  const { data, error } = await supabase
    .from('attractions')
    .insert({
      name: attraction.name,
      description: attraction.description,
      image: attraction.image,
      latitude: attraction.location.lat,
      longitude: attraction.location.lng,
      address: attraction.location.address,
      city: attraction.location.city,
      state: attraction.location.state,
      rating: attraction.rating,
      category: attraction.category,
      admission_fee: attraction.admission_fee,
      opening_hours: attraction.opening_hours,
      website: attraction.website
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating attraction:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.image,
    location: {
      lat: data.latitude,
      lng: data.longitude,
      address: data.address,
      city: data.city,
      state: data.state
    },
    rating: data.rating,
    reviews: [],
    category: data.category,
    admission_fee: data.admission_fee,
    opening_hours: data.opening_hours,
    website: data.website
  };
}

// UPDATE operations
export async function updateAttraction(id: string, updates: Partial<Omit<Attraction, 'id' | 'reviews'>>): Promise<void> {
  const { error } = await supabase
    .from('attractions')
    .update({
      name: updates.name,
      description: updates.description,
      image: updates.image,
      latitude: updates.location?.lat,
      longitude: updates.location?.lng,
      address: updates.location?.address,
      city: updates.location?.city,
      state: updates.location?.state,
      rating: updates.rating,
      category: updates.category,
      admission_fee: updates.admission_fee,
      opening_hours: updates.opening_hours,
      website: updates.website
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating attraction:', error);
    throw error;
  }
}

// DELETE operations
export async function deleteAttraction(id: string): Promise<void> {
  const { error } = await supabase
    .from('attractions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting attraction:', error);
    throw error;
  }
}

// Review CRUD operations
export async function createReview(attractionId: string, rating: number, comment: string): Promise<Review> {
  const { data: review, error } = await supabase
    .from('reviews')
    .insert({
      attraction_id: attractionId,
      rating,
      comment
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }

  return {
    id: review.id,
    userId: review.user_id,
    userName: 'Anonymous',
    rating: review.rating,
    comment: review.comment,
    date: review.created_at
  };
}

export async function updateReview(reviewId: string, rating: number, comment: string): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .update({
      rating,
      comment
    })
    .eq('id', reviewId);

  if (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}