import { ApifyClient } from 'apify-client';
import { Attraction } from '../types';

const client = new ApifyClient({
    token: 'YOUR_APIFY_TOKEN',
});

export async function fetchAttractions(): Promise<Attraction[]> {
    try {
        const searchQueries = [
            // Landmarks
            "Empire State Building",
            "Statue of Liberty",
            "Brooklyn Bridge",
            "Chrysler Building",
            "One World Trade Center",
            
            // Sightseeing & Must-visit places
            "Times Square New York",
            "Rockefeller Center",
            "Grand Central Terminal",
            "Fifth Avenue New York",
            "Broadway Theater District",
            
            // Historical sites
            "Ellis Island",
            "Federal Hall NYC",
            "Trinity Church Wall Street",
            "St. Patrick's Cathedral NYC",
            "Theodore Roosevelt Birthplace",
            
            // Cultural attractions
            "Metropolitan Opera House",
            "Carnegie Hall",
            "Lincoln Center",
            "Radio City Music Hall",
            "Broadway Shows",
            
            // Parks and gardens
            "Central Park attractions",
            "Bryant Park",
            "High Line park",
            "Brooklyn Botanic Garden",
            "Washington Square Park",
            
            // Museums and galleries
            "Metropolitan Museum of Art",
            "MoMA NYC",
            "American Museum of Natural History",
            "Whitney Museum",
            "Guggenheim Museum"
        ];

        const run = await client.actor("compass/google-maps-scraper").call({
            searchStrings: searchQueries,
            maxCrawledPlaces: 100,
            language: "en",
            maxImages: 3,
            includeReviews: true,
            maxReviews: 20,
            reviewsSort: "newest",
            includeOpeningHours: true,
            includePriceRange: true,
            proxyConfiguration: { useApifyProxy: true },
            startUrls: [{
                url: "https://www.google.com/maps/search/attractions/@40.7128,-74.0060,12z"
            }]
        });

        const dataset = await client.dataset(run.defaultDatasetId).listItems();
        
        // Filter for New York locations only
        const nyAttractions = dataset.filter((item: any) => {
            const address = (item.address || '').toLowerCase();
            return address.includes('new york') || 
                   address.includes('ny') || 
                   address.includes('nyc') ||
                   address.includes('manhattan') ||
                   address.includes('brooklyn') ||
                   address.includes('queens') ||
                   address.includes('bronx') ||
                   address.includes('staten island');
        });
        
        return nyAttractions.map((item: any) => ({
            id: item.placeId || String(Math.random()),
            name: item.title,
            description: item.description || formatDescription(item),
            image: selectBestImage(item.images),
            location: {
                lat: item.location?.lat || 0,
                lng: item.location?.lng || 0,
                address: item.address || '',
                city: 'New York City',
                state: 'NY'
            },
            rating: item.totalScore || 0,
            reviews: (item.reviews || []).map((review: any) => ({
                id: review.id || String(Math.random()),
                userId: review.reviewId || 'anonymous',
                userName: review.name || 'Anonymous User',
                rating: review.stars || 0,
                comment: review.text || '',
                date: review.publishedAtDate || new Date().toISOString()
            })),
            category: determineCategory(item),
            admission_fee: formatPrice(item.priceRange),
            opening_hours: formatOpeningHours(item.openingHours),
            website: item.website || ''
        }));
    } catch (error) {
        console.error('Error fetching attractions:', error);
        return [];
    }
}

function determineCategory(item: any): string {
    const name = (item.title || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const description = (item.description || '').toLowerCase();

    // Define category patterns
    const categories = {
        'Museums and Galleries': ['museum', 'gallery', 'art', 'exhibition', 'collection'],
        'Parks and Gardens': ['park', 'garden', 'botanical', 'green space', 'recreation'],
        'Landmarks': ['building', 'tower', 'bridge', 'statue', 'monument', 'square', 'center'],
        'Historical Sites': ['historic', 'heritage', 'memorial', 'cemetery', 'church', 'cathedral'],
        'Cultural Attractions': ['theater', 'theatre', 'opera', 'concert', 'hall', 'performance', 'broadway'],
        'Popular Destinations': ['attraction', 'tourist', 'famous', 'destination', 'spot'],
        'Sightseeing': ['observation', 'view', 'deck', 'tour', 'cruise'],
        'Things to Do': ['activity', 'experience', 'entertainment', 'shopping']
    };

    // Check each category's patterns against the item's properties
    for (const [categoryName, patterns] of Object.entries(categories)) {
        if (patterns.some(pattern => 
            name.includes(pattern) || 
            category.includes(pattern) || 
            description.includes(pattern)
        )) {
            return categoryName;
        }
    }

    // Special cases for well-known attractions
    const specialCases: { [key: string]: string } = {
        'empire state': 'Landmarks',
        'statue of liberty': 'Landmarks',
        'brooklyn bridge': 'Landmarks',
        'central park': 'Parks and Gardens',
        'times square': 'Popular Destinations',
        'metropolitan museum': 'Museums and Galleries',
        'broadway': 'Cultural Attractions',
        'ellis island': 'Historical Sites'
    };

    for (const [keyword, category] of Object.entries(specialCases)) {
        if (name.includes(keyword)) {
            return category;
        }
    }

    return 'Popular Destinations';
}

function formatDescription(item: any): string {
    if (item.description) return item.description;
    
    const parts = [];
    if (item.reviewsCount) {
        parts.push(`${item.reviewsCount} reviews on Google Maps`);
    }
    if (item.category) {
        parts.push(`${item.category} in New York City`);
    }
    if (item.totalScore) {
        parts.push(`Rated ${item.totalScore.toFixed(1)} stars`);
    }
    
    return parts.join('. ') || 'Explore this New York City attraction';
}

function selectBestImage(images: string[] = []): string {
    if (!images || images.length === 0) {
        return 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29';
    }
    
    // Filter out any invalid URLs
    const validImages = images.filter(url => url && url.startsWith('http'));
    return validImages[0] || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29';
}

function formatPrice(priceRange: any): string {
    if (!priceRange) return 'Contact for pricing';
    if (typeof priceRange === 'string') return priceRange;
    if (Array.isArray(priceRange)) return priceRange.join(' - ');
    return 'Contact for pricing';
}

function formatOpeningHours(hours: any): string {
    if (!hours) return 'Hours not available';
    if (typeof hours === 'string') return hours;
    if (Array.isArray(hours)) return hours.join(', ');
    return 'Hours not available';
}