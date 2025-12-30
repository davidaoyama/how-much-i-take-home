/**
 * API Route: Calculate Tax
 *
 * Server-side endpoint that calls API Ninjas Income Tax Calculator
 * This keeps the API key secure (never exposed to client)
 */

import { NextRequest, NextResponse } from 'next/server';
import { TaxCalculationRequest, TaxCalculation } from '@/lib/types';

/**
 * POST /api/calculate-tax
 *
 * Request body:
 * {
 *   salary: number,
 *   filingStatus: FilingStatus,
 *   stateCode: string
 * }
 *
 * Response:
 * {
 *   data?: TaxCalculation,
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: TaxCalculationRequest = await request.json();
    const { salary, filingStatus, stateCode } = body;

    // Validate required fields
    if (!salary || !filingStatus || !stateCode) {
      return NextResponse.json(
        { error: 'Missing required fields: salary, filingStatus, stateCode' },
        { status: 400 }
      );
    }

    // Validate salary
    if (typeof salary !== 'number' || salary <= 0) {
      return NextResponse.json(
        { error: 'Invalid salary: must be a positive number' },
        { status: 400 }
      );
    }

    // Validate filing status
    const validFilingStatuses = ['single', 'married', 'married_separate', 'head_of_household'];
    if (!validFilingStatuses.includes(filingStatus)) {
      return NextResponse.json(
        { error: 'Invalid filing status' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.API_NINJAS_KEY;
    if (!apiKey) {
      console.error('API_NINJAS_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: API key not found' },
        { status: 500 }
      );
    }

    // Call API Ninjas Income Tax Calculator
    const apiUrl = `https://api.api-ninjas.com/v1/incometaxcalculator?income=${salary}&filing_status=${filingStatus}&region=${stateCode}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Ninjas error:', response.status, errorText);

      // Return user-friendly error messages
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: 'API authentication failed. Please check your API key.' },
          { status: 500 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to calculate tax. Please try again.' },
        { status: 500 }
      );
    }

    // Parse successful response
    const data: TaxCalculation = await response.json();

    // Validate response data
    if (!data || typeof data.income_after_tax !== 'number') {
      console.error('Invalid response from API Ninjas:', data);
      return NextResponse.json(
        { error: 'Invalid response from tax calculation service' },
        { status: 500 }
      );
    }

    // Return successful result
    return NextResponse.json({ data });

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in calculate-tax API route:', error);

    // Check for network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported methods
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  );
}
