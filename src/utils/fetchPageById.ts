import { validate as validateUUID } from 'uuid';
import { ApiResponse, Page } from '../types/page.types';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

export async function fetchPageById(id: string): Promise<Page | null> {
  try {
    // Validate the ID before making the request
    if (!validateUUID(id)) {
      console.error('Invalid UUID provided:', id);
      throw new Error('Invalid UUID format');
    }

    const url = `${API_BASE_URL}/pages/id/${id}`;
    console.log('Fetching page by ID:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching page by ID: ${response.statusText}`);
    }

    // Added explicit casting for the fetch response
    const result = (await response.json()) as ApiResponse<Page>;
    console.log('Response data:', result);

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Unknown error');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching page by ID:', error);
    return null;
  }
}