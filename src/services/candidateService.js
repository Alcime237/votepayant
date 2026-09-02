import apiClient from './apiClient';

export async function getCandidatesByCategory(category) {
  const { data } = await apiClient.get('/api/candidates', { params: { category } });
  return data;
}
