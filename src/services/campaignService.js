import apiClient from './apiClient';

/** @returns {Promise<{active: boolean, campaignId: string|null, endDate: string|null, serverTime: string}>} */
export async function getCampaignStatus() {
  const { data } = await apiClient.get('/api/campaign/status');
  return data;
}
