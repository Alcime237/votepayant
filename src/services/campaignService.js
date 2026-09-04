import apiClient from './apiClient';
import { isDemoMode, isUnreachableError, markDemoMode } from './demoMode';
import { buildMockCampaignStatus } from './mockData';

/** @returns {Promise<{active: boolean, campaignId: string|null, endDate: string|null, serverTime: string, phase: string}>} */
export async function getCampaignStatus() {
  if (isDemoMode()) {
    return buildMockCampaignStatus();
  }

  try {
    const { data } = await apiClient.get('/api/campaign/status');
    return data;
  } catch (error) {
    if (isUnreachableError(error)) {
      // Serveur injoignable : campagne de démonstration toujours "active", pour que le
      // compte à rebours et les pages de vote aient un contenu crédible malgré tout.
      markDemoMode();
      return buildMockCampaignStatus();
    }
    throw error;
  }
}
