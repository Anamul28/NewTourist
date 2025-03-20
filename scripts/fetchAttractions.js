import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from the root .env file
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchAndStoreAttractions() {
  try {
    console.log('Starting attraction data import...');
    
    // Read mock data from JSON file
    const mockDataPath = join(__dirname, 'mockAttractions.json');
    const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf8'));
    
    console.log(`Found ${mockData.length} attractions in mock data`);

    // Insert attractions into Supabase
    let successCount = 0;
    let errorCount = 0;

    for (const item of mockData) {
      try {
        // Check if attraction already exists
        const { data: existing } = await supabase
          .from('attractions')
          .select('id')
          .eq('name', item.name)
          .single();

        const attraction = {
          name: item.name,
          description: item.description,
          image: item.image,
          latitude: item.location.lat,
          longitude: item.location.lng,
          address: item.location.address,
          city: item.location.city,
          state: item.location.state,
          rating: item.rating,
          category: item.category,
          admission_fee: item.admission_fee,
          opening_hours: item.opening_hours,
          website: item.website
        };

        let error;
        if (existing) {
          // Update existing attraction
          const { error: updateError } = await supabase
            .from('attractions')
            .update(attraction)
            .eq('id', existing.id);
          error = updateError;
          console.log(`Updated existing attraction: ${attraction.name}`);
        } else {
          // Insert new attraction
          const { error: insertError } = await supabase
            .from('attractions')
            .insert(attraction);
          error = insertError;
          console.log(`Inserted new attraction: ${attraction.name}`);
        }

        if (error) {
          console.error(`Error processing ${attraction.name}:`, error);
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
    console.log(`Total attractions found: ${mockData.length}`);
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