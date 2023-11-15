import { LocationType } from "../entity";
import axios from "axios"
import { GOOGLE } from "./env";

export interface ReverseLocation {
	[key: string]: any;
}

const types = ["locality", "city", "country", "administrative_area_level_1", "administrative_area_level_2"]

export async function getLocationInfo({ latitude, longitude }: LocationType) {
  try {
    // Set up your Google Maps Geocoding API key
    const apiKey = GOOGLE.MAPS_API_KEY;

    // Construct the API request URL
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    // Make the API request
    const response = await axios.get(apiUrl);

    // Check if the request was successful
    if (response.data.status === 'OK') {
      const addressComponents = response.data.results[0].address_components;
      let country = '';
      let state = '';
      let city = '';

      // Iterate through the address components to extract country, state, and city
      for (const component of addressComponents) {
        if (component.types.includes('country')) {
          country = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        } else if (component.types.includes('locality')) {
          city = component.long_name;
        }
      }

      // Return the location information
      return {
        country,
        state,
        city,
      };
    } else {
      throw new Error('Geocoding API request failed');
    }
  } catch (error) {
    console.error('Error getting location information:', error);
    throw error;
  }
}
