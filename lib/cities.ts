/**
 * Hardcoded city data with average rent prices
 * Data sourced from various rental market reports (2024-2025)
 */

import { City } from './types';

/**
 * List of 25 major US cities with average 1BR apartment rent
 * Sorted alphabetically by city name for easy navigation
 */
export const CITIES: City[] = [
  {
    id: 'atlanta',
    name: 'Atlanta',
    state: 'Georgia',
    stateCode: 'GA',
    avgRent: 1600,
  },
  {
    id: 'austin',
    name: 'Austin',
    state: 'Texas',
    stateCode: 'TX',
    avgRent: 1700,
  },
  {
    id: 'boston',
    name: 'Boston',
    state: 'Massachusetts',
    stateCode: 'MA',
    avgRent: 2800,
  },
  {
    id: 'charlotte',
    name: 'Charlotte',
    state: 'North Carolina',
    stateCode: 'NC',
    avgRent: 1500,
  },
  {
    id: 'chicago',
    name: 'Chicago',
    state: 'Illinois',
    stateCode: 'IL',
    avgRent: 1900,
  },
  {
    id: 'columbus',
    name: 'Columbus',
    state: 'Ohio',
    stateCode: 'OH',
    avgRent: 1300,
  },
  {
    id: 'dallas',
    name: 'Dallas',
    state: 'Texas',
    stateCode: 'TX',
    avgRent: 1600,
  },
  {
    id: 'denver',
    name: 'Denver',
    state: 'Colorado',
    stateCode: 'CO',
    avgRent: 2000,
  },
  {
    id: 'detroit',
    name: 'Detroit',
    state: 'Michigan',
    stateCode: 'MI',
    avgRent: 1200,
  },
  {
    id: 'la',
    name: 'Los Angeles',
    state: 'California',
    stateCode: 'CA',
    avgRent: 2600,
  },
  {
    id: 'vegas',
    name: 'Las Vegas',
    state: 'Nevada',
    stateCode: 'NV',
    avgRent: 1600,
  },
  {
    id: 'miami',
    name: 'Miami',
    state: 'Florida',
    stateCode: 'FL',
    avgRent: 2200,
  },
  {
    id: 'minneapolis',
    name: 'Minneapolis',
    state: 'Minnesota',
    stateCode: 'MN',
    avgRent: 1600,
  },
  {
    id: 'nashville',
    name: 'Nashville',
    state: 'Tennessee',
    stateCode: 'TN',
    avgRent: 1700,
  },
  {
    id: 'nyc',
    name: 'New York',
    state: 'New York',
    stateCode: 'NY',
    avgRent: 3500,
  },
  {
    id: 'philadelphia',
    name: 'Philadelphia',
    state: 'Pennsylvania',
    stateCode: 'PA',
    avgRent: 1800,
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    state: 'Arizona',
    stateCode: 'AZ',
    avgRent: 1500,
  },
  {
    id: 'portland',
    name: 'Portland',
    state: 'Oregon',
    stateCode: 'OR',
    avgRent: 1800,
  },
  {
    id: 'raleigh',
    name: 'Raleigh',
    state: 'North Carolina',
    stateCode: 'NC',
    avgRent: 1400,
  },
  {
    id: 'slc',
    name: 'Salt Lake City',
    state: 'Utah',
    stateCode: 'UT',
    avgRent: 1500,
  },
  {
    id: 'sandiego',
    name: 'San Diego',
    state: 'California',
    stateCode: 'CA',
    avgRent: 2700,
  },
  {
    id: 'sf',
    name: 'San Francisco',
    state: 'California',
    stateCode: 'CA',
    avgRent: 3200,
  },
  {
    id: 'seattle',
    name: 'Seattle',
    state: 'Washington',
    stateCode: 'WA',
    avgRent: 2400,
  },
  {
    id: 'tampa',
    name: 'Tampa',
    state: 'Florida',
    stateCode: 'FL',
    avgRent: 1800,
  },
  {
    id: 'dc',
    name: 'Washington',
    state: 'D.C.',
    stateCode: 'DC',
    avgRent: 2500,
  },
];

/**
 * Helper function to get city data by ID
 */
export function getCityById(cityId: string): City | undefined {
  return CITIES.find((city) => city.id === cityId);
}

/**
 * Helper function to get city display name (e.g., "New York, NY")
 */
export function getCityDisplayName(cityId: string): string {
  const city = getCityById(cityId);
  if (!city) return '';
  return `${city.name}, ${city.stateCode}`;
}

/**
 * Helper function to get average rent for a city
 */
export function getCityRent(cityId: string): number {
  const city = getCityById(cityId);
  return city?.avgRent || 0;
}
