import { useSyncExternalStore } from 'react';
import { isDemoBannerVisible, subscribeDemoMode } from '../services/demoMode';

/** true tant que le serveur est injoignable et que l'app affiche des données de démonstration. */
export default function useDemoMode() {
  return useSyncExternalStore(subscribeDemoMode, isDemoBannerVisible);
}
