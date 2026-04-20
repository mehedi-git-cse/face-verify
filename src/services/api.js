const API_BASE_URL = 'http://127.0.0.1:7000/api/v1';

// Token stored in memory (not localStorage for security)
let accessToken = null;

/**
 * Get authentication token from the API
 */
export async function getToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/get-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: 'image-8989',
        client_secret: 'atik-check-8888',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json();
    // Handle nested response structure: data.data.access_token
    accessToken = data.data?.access_token || data.access_token || data.token;
    
    if (!accessToken) {
      console.error('Token response:', data);
      throw new Error('No token received from API');
    }
    
    return accessToken;
  } catch (error) {
    console.error('Failed to get token:', error);
    throw error;
  }
}

/**
 * Check if we have a valid token
 */
export function hasToken() {
  return !!accessToken;
}

/**
 * Verify face from image file
 * @param {File} imageFile - The image file to verify
 */
export async function verifyFace(imageFile) {
  if (!accessToken) {
    throw new Error('No access token available. Please authenticate first.');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/verify-face`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        accessToken = null;
        throw new Error('Token expired. Please refresh the page.');
      }
      throw new Error(`Verification failed: ${response.status}`);
    }

    // Return full response for detailed parsing
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Face verification failed:', error);
    throw error;
  }
}

/**
 * Convert base64 data URL to File object
 * @param {string} dataUrl - Base64 data URL
 * @param {string} filename - Desired filename
 */
export function dataUrlToFile(dataUrl, filename = 'captured-image.jpg') {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
