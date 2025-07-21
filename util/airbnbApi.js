const axios = require('axios');

class AirbnbAPI {
  constructor() {
    this.baseURL = 'https://airbnb13.p.rapidapi.com';
    this.apiKey = process.env.RAPIDAPI_KEY;
  }

  async searchListings(query, location = '') {
    console.log(`🔍 Searching for: "${query}" in "${location}"`);
    
    try {
      if (!this.apiKey) {
        console.log('No API key provided, using sample search data');
        return this.getSampleSearchResults(query, location);
      }

      // For now, we'll use sample data since the actual search endpoint might be different
      // You can replace this with the actual Airbnb search API call
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          query: query,
          location: location,
          locale: 'en',
          currency: 'USD'
        },
        headers: {
          'x-rapidapi-host': 'airbnb13.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching Airbnb listings:', error.message);
      return this.getSampleSearchResults(query, location);
    }
  }

  getSampleSearchResults(query, location) {
    // Sample search results based on query
    const allSampleListings = {
      'paris': [
        {
          title: "Lisa's room near Paris and La Défense",
          description: "Room in Rueil-Malmaison, France",
          location: "Rueil-Malmaison, Île-de-France",
          country: "France",
          price: 85,
          image: {
            url: "https://a0.muscache.com/im/pictures/airflow/Hosting-41684233/original/16a80c2b-3198-46b1-ba40-eed6448ce25e.jpg"
          },
          rating: 4.85,
          reviewsCount: 192,
          host: "Valérie Et Jean",
          type: "Private room in home",
          amenities: ["1 double bed", "Shared half bathroom"]
        },
        {
          title: "Charming Studio in Montmartre",
          description: "Entire apartment in Paris, France",
          location: "Paris, Île-de-France",
          country: "France",
          price: 120,
          image: {
            url: "https://images.unsplash.com/photo-1502602898534-861d9d5e4b1a?w=500"
          },
          rating: 4.8,
          reviewsCount: 156,
          host: "Marie Dubois",
          type: "Entire apartment",
          amenities: ["1 bedroom", "1 bathroom", "Kitchen", "Balcony"]
        }
      ],
      'new york': [
        {
          title: "Cozy Studio in Downtown",
          description: "Entire apartment in New York, NY",
          location: "New York",
          country: "United States",
          price: 120,
          image: {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
          },
          rating: 4.7,
          reviewsCount: 89,
          host: "Sarah Johnson",
          type: "Entire apartment",
          amenities: ["1 bedroom", "1 bathroom", "Kitchen"]
        },
        {
          title: "Luxury Loft in Manhattan",
          description: "Entire apartment in New York, NY",
          location: "Manhattan, New York",
          country: "United States",
          price: 250,
          image: {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"
          },
          rating: 4.9,
          reviewsCount: 234,
          host: "David Chen",
          type: "Entire apartment",
          amenities: ["2 bedrooms", "2 bathrooms", "Kitchen", "Gym access"]
        }
      ],
      'aspen': [
        {
          title: "Mountain View Cabin",
          description: "Entire cabin in Aspen, CO",
          location: "Aspen",
          country: "United States",
          price: 200,
          image: {
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500"
          },
          rating: 4.9,
          reviewsCount: 156,
          host: "Mike Wilson",
          type: "Entire cabin",
          amenities: ["2 bedrooms", "1 bathroom", "Mountain views"]
        }
      ],
      'tokyo': [
        {
          title: "Modern Apartment in Shibuya",
          description: "Entire apartment in Tokyo, Japan",
          location: "Shibuya, Tokyo",
          country: "Japan",
          price: 95,
          image: {
            url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500"
          },
          rating: 4.6,
          reviewsCount: 78,
          host: "Yuki Tanaka",
          type: "Entire apartment",
          amenities: ["1 bedroom", "1 bathroom", "Kitchen", "City view"]
        }
      ],
      'cave': [
        {
          title: "Underground Cave Villa",
          description: "Unique cave dwelling experience",
          location: "Cappadocia, Turkey",
          country: "Turkey",
          price: 150,
          image: {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
          },
          rating: 4.8,
          reviewsCount: 89,
          host: "Ahmet Yilmaz",
          type: "Entire cave",
          amenities: ["1 bedroom", "1 bathroom", "Cave experience", "Unique architecture"]
        }
      ],
      'villa': [
        {
          title: "Luxury Villa with Pool",
          description: "Private villa with stunning views",
          location: "Bali, Indonesia",
          country: "Indonesia",
          price: 300,
          image: {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"
          },
          rating: 4.9,
          reviewsCount: 156,
          host: "Made Sari",
          type: "Entire villa",
          amenities: ["3 bedrooms", "2 bathrooms", "Private pool", "Garden"]
        }
      ],
      'home': [
        {
          title: "Cozy Family Home",
          description: "Perfect family getaway",
          location: "Lake District, UK",
          country: "United Kingdom",
          price: 180,
          image: {
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500"
          },
          rating: 4.7,
          reviewsCount: 123,
          host: "Emma Thompson",
          type: "Entire home",
          amenities: ["4 bedrooms", "2 bathrooms", "Garden", "Lake view"]
        }
      ]
    };

    const searchTerm = query.toLowerCase();
    let results = [];

    // Search through all sample listings
    for (const [key, listings] of Object.entries(allSampleListings)) {
      if (key.includes(searchTerm) || searchTerm.includes(key)) {
        results = results.concat(listings);
      }
    }

    // If no specific results, return themed results based on search term
    if (results.length === 0) {
      const themedResults = {
        'beach': {
          title: "Beachfront Paradise",
          description: "Stunning beachfront property",
          location: "Maldives",
          country: "Maldives",
          price: Math.floor(Math.random() * 200) + 100,
          image: {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500"
          },
          rating: 4.5 + Math.random() * 0.5,
          reviewsCount: Math.floor(Math.random() * 200) + 10,
          host: "Island Host",
          type: "Entire place",
          amenities: ["1 bedroom", "1 bathroom", "Beach access"]
        },
        'mountain': {
          title: "Mountain Retreat",
          description: "Peaceful mountain getaway",
          location: "Swiss Alps",
          country: "Switzerland",
          price: Math.floor(Math.random() * 200) + 100,
          image: {
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500"
          },
          rating: 4.5 + Math.random() * 0.5,
          reviewsCount: Math.floor(Math.random() * 200) + 10,
          host: "Alpine Host",
          type: "Entire place",
          amenities: ["1 bedroom", "1 bathroom", "Mountain views"]
        },
        'city': {
          title: "Urban Oasis",
          description: "Modern city apartment",
          location: "Downtown",
          country: "Global",
          price: Math.floor(Math.random() * 200) + 50,
          image: {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
          },
          rating: 4.5 + Math.random() * 0.5,
          reviewsCount: Math.floor(Math.random() * 200) + 10,
          host: "City Host",
          type: "Entire place",
          amenities: ["1 bedroom", "1 bathroom", "City view"]
        }
      };

      // Try to match search term with themed results
      for (const [theme, result] of Object.entries(themedResults)) {
        if (searchTerm.includes(theme)) {
          results.push(result);
          break;
        }
      }

      // If still no results, return a generic listing
      if (results.length === 0) {
        results = [
          {
            title: "Beautiful Home Anywhere",
            description: "Amazing place to stay",
            location: "Anywhere",
            country: "World",
            price: Math.floor(Math.random() * 200) + 50,
            image: {
              url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
            },
            rating: 4.5 + Math.random() * 0.5,
            reviewsCount: Math.floor(Math.random() * 200) + 10,
            host: "Wonderful Host",
            type: "Entire place",
            amenities: ["1 bedroom", "1 bathroom", "Kitchen"]
          }
        ];
      }
    }

    return {
      error: false,
      results: results
    };
  }

  async getListing(listingId) {
    try {
      if (!this.apiKey) {
        console.log('No API key provided, using sample data');
        return this.getSampleListing(listingId);
      }

      const response = await axios.get(`${this.baseURL}/room`, {
        params: {
          listing_id: listingId,
          locale: 'en',
          currency: 'USD'
        },
        headers: {
          'x-rapidapi-host': 'airbnb13.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Airbnb listing:', error.message);
      return this.getSampleListing(listingId);
    }
  }

  getSampleListing(listingId) {
    // Sample data based on the API response you provided
    const sampleListings = {
      '41684233': {
        title: "Lisa's room near Paris and La Défense",
        description: "Room in Rueil-Malmaison, France",
        location: "Rueil-Malmaison, Île-de-France",
        country: "France",
        price: 85,
        image: {
          url: "https://a0.muscache.com/im/pictures/airflow/Hosting-41684233/original/16a80c2b-3198-46b1-ba40-eed6448ce25e.jpg"
        },
        rating: 4.85,
        reviewsCount: 192,
        host: "Valérie Et Jean",
        type: "Private room in home",
        amenities: ["1 double bed", "Shared half bathroom"]
      },
      '12345678': {
        title: "Cozy Studio in Downtown",
        description: "Entire apartment in New York, NY",
        location: "New York",
        country: "United States",
        price: 120,
        image: {
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
        },
        rating: 4.7,
        reviewsCount: 89,
        host: "Sarah Johnson",
        type: "Entire apartment",
        amenities: ["1 bedroom", "1 bathroom", "Kitchen"]
      },
      '87654321': {
        title: "Mountain View Cabin",
        description: "Entire cabin in Aspen, CO",
        location: "Aspen",
        country: "United States",
        price: 200,
        image: {
          url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500"
        },
        rating: 4.9,
        reviewsCount: 156,
        host: "Mike Wilson",
        type: "Entire cabin",
        amenities: ["2 bedrooms", "1 bathroom", "Mountain views"]
      }
    };

    return {
      error: false,
      results: sampleListings[listingId] || sampleListings['41684233']
    };
  }

  async getFeaturedListings() {
    console.log("🔍 Getting featured listings...");
    // Sample listing IDs for featured listings
    const featuredIds = [
      '41684233', // Lisa's room near Paris
      '12345678', // Cozy Studio
      '87654321'  // Mountain Cabin
    ];

    const listings = [];
    
    for (const id of featuredIds) {
      console.log(`📡 Fetching listing ${id}...`);
      const listing = await this.getListing(id);
      console.log(`📊 Listing ${id} result:`, listing);
      if (listing && !listing.error) {
        const transformed = this.transformListing(listing.results);
        console.log(`✅ Transformed listing:`, transformed);
        listings.push(transformed);
      }
    }

    console.log(`🎯 Total featured listings: ${listings.length}`);
    return listings;
  }

  transformListing(airbnbData) {
    return {
      title: airbnbData.title,
      description: airbnbData.description,
      location: airbnbData.location,
      country: airbnbData.country,
      price: airbnbData.price,
      image: {
        url: airbnbData.image.url
      },
      rating: airbnbData.rating,
      reviewsCount: airbnbData.reviewsCount,
      host: airbnbData.host,
      type: airbnbData.type,
      amenities: airbnbData.amenities
    };
  }
}

module.exports = new AirbnbAPI(); 