export interface DVLAVehicleData {
  make: string;
  yearOfManufacture: number;
  fuelType: string;
  engineCapacity: number; // in cc
  model?: string;
  colour?: string;
  typeApproval?: string;
  // Enhanced fields from multi-source lookup
  transmission?: string;
  bodyType?: string;
  doors?: string;
  taxStatus?: string;
  motStatus?: string;
  co2Emissions?: number;
  confidence?: string;
  sources?: string[];
}

/**
 * Calls the backend proxy to fetch real vehicle data from the DVLA.
 */
export async function lookupVehicle(registration: string): Promise<DVLAVehicleData> {
  try {
    const response = await fetch('/api/lookup-dvla', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registration }),
    });

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || `Failed to lookup vehicle (${response.status})`);
      } else {
        const text = await response.text();
        throw new Error(`API Error (${response.status}): ${text.substring(0, 100)}`);
      }
    }

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Received non-JSON response from API');
    }

    return await response.json();
  } catch (error: any) {
    console.error('DVLA Lookup Error:', error);
    throw error;
  }
}
