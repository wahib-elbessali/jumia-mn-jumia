import axios from 'axios';

const IMGHIPPO_API_KEY = 'ef63928cc8bbec22eee9452ad0043391';

// Upload an image to Imghippo
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('api_key', IMGHIPPO_API_KEY);
  formData.append('file', file);

  try {
    const response = await axios.post('https://api.imghippo.com/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data.url; // Return the image URL
    } else {
      throw new Error(response.data.message || 'Failed to upload image');
    }
  } catch (err) {
    console.error('Error uploading image:', err);
    throw err;
  }
};