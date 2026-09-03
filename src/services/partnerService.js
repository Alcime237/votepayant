import apiClient from './apiClient';

export async function getPartners() {
  const { data } = await apiClient.get('/api/partenaires');
  return data;
}
