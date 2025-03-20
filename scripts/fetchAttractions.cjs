const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const mockAttractions = [
  {
    name: "Statue of Liberty",
    description: "Iconic symbol of freedom and democracy, standing tall in New York Harbor.",
    image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&q=80&w=800",
    latitude: 40.6892,
    longitude: -74.0445,
    address: "Liberty Island",
    city: "New York City",
    state: "NY",
    rating: 4.8,
    category: "Landmarks",
    admission_fee: "$23.50 for adults, $12 for children (4-12)",
    opening_hours: "9:00 AM - 5:00 PM daily",
    website: "https://www.nps.gov/stli/"
  },
  {
    name: "Empire State Building",
    description: "Iconic Art Deco skyscraper with observation decks offering panoramic city views.",
    image: "https://images.unsplash.com/photo-1555109307-f0b72a1f3729?auto=format&fit=crop&q=80&w=800",
    latitude: 40.7484,
    longitude: -73.9857,
    address: "20 W 34th St",
    city: "New York City",
    state: "NY",
    rating: 4.7,
    category: "Landmarks",
    admission_fee: "$42 for adults, $36 for children (6-12)",
    opening_hours: "8:00 AM - 2:00 AM daily",
    website: "https://www.esbnyc.com/"
  },
  {
    name: "Central Park",
    description: "Sprawling urban oasis with walking paths, a zoo, and various attractions.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=800",
    latitude: 40.7829,
    longitude: -73.9654,
    address: "Central Park",
    city: "New York City",
    state: "NY",
    rating: 4.9,
    category: "Parks and Gardens",
    admission_fee: "Free",
    opening_hours: "6:00 AM - 1:00 AM daily",
    website: "https://www.centralparknyc.org/"
  },
  {
    name: "Metropolitan Museum of Art",
    description: "World-renowned art museum with an extensive collection spanning over 5,000 years of human creativity.",
    image: "https://images.unsplash.com/photo-1542341375-af70f5e4c819?auto=format&fit=crop&q=80&w=800",
    latitude: 40.7794,
    longitude: -73.9632,
    address: "1000 5th Ave",
    city: "New York City",
    state: "NY",
    rating: 4.8,
    category: "Museums and Galleries",
    admission_fee: "$25 for adults, free for children under 12",
    opening_hours: "10:00 AM - 5:00 PM, Closed Wednesdays",
    website: "https://www.metmuseum.org/"
  },
  {
    name: "Times Square",
    description: "Iconic intersection known for its bright lights, Broadway theaters, and vibrant atmosphere.",
    image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=800",
    latitude: 40.7580,
    longitude: -73.9855,
    address: "Times Square",
    city: "New York City",
    state: "NY",
    rating: 4.7,
    category: "Popular Destinations",
    admission_fee: "Free",
    opening_hours: "24/7",
    website: "https://www.timessquarenyc.org/"
  }
];

async function fetchAndStoreAttractions() {
  try {
    console.log('Starting attraction data import...');
    
    let successCount = 0;
    let errorCount = 0;

    for (const item of mockAttractions) {
      try {
        // Check if attraction already exists
        const { data: existing } = await supabase
          .from('attractions')
          .select('id')
          .eq('name', item.name)
          .single();

        let error;
        if (existing) {
          // Update existing attraction
          const { error: updateError } = await supabase
            .from('attractions')
            .update(item)
            .eq('id', existing.id);
          error = updateError;
          console.log(`Updated existing attraction: ${item.name}`);
        } else {
          // Insert new attraction
          const { error: insertError } = await supabase
            .from('attractions')
            .insert(item);
          error = insertError;
          console.log(`Inserted new attraction: ${item.name}`);
        }

        if (error) {
          console.error(`Error processing ${item.name}:`, error);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        console.error(`Error processing attraction:`, error);
        errorCount++;
      }
    }

    console.log('\nImport Summary:');
    console.log(`Total attractions found: ${mockAttractions.length}`);
    console.log(`Successfully processed: ${successCount}`);
    console.log(`Failed to process: ${errorCount}`);

    if (errorCount > 0) {
      throw new Error(`Failed to process ${errorCount} attractions`);
    }

    console.log('Finished importing attractions to Supabase');
  } catch (error) {
    console.error('Error in fetchAndStoreAttractions:', error);
    process.exit(1);
  }
}

// Run the script
fetchAndStoreAttractions();