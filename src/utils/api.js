import axios from 'axios';

const API_URL = 'https://testapi.pinelabs.com/v1/billing-integration/qr-payments/transactions/digital-invoice-v2/create';

export const createDigitalInvoice = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json',
        'correlation-id': '123455',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('API call failed: ' + error.message);
  }
};