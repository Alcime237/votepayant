import React from 'react';

/**
 * Silhouette stylisée (low-poly) du continent africain, avec le Sénégal
 * mis en évidence par un repère lumineux — illustration décorative, pas
 * une carte cartographique précise.
 */
const AfricaSenegalMap = () => (
  <svg viewBox="0 0 300 330" className="africaMap__svg" role="img" aria-label="Carte de l'Afrique avec le Sénégal mis en évidence">
    <path
      className="africaMap__continent"
      d="M200,12 L222,18 L245,35 L235,55 L255,75 L248,100 L268,125 L250,140 L232,152
         L222,175 L228,200 L218,225 L222,250 L205,270 L210,292 L188,310 L172,300
         L178,275 L160,260 L165,232 L145,222 L138,195 L118,188 L108,168 L120,152
         L100,150 L78,160 L55,168 L38,158 L20,148 L12,122 L22,98 L35,105 L42,80
         L60,55 L48,45 L68,28 L95,20 L120,25 L145,15 L172,10 Z"
    />

    {/* Madagascar */}
    <path
      className="africaMap__continent africaMap__madagascar"
      d="M258,225 L266,235 L264,255 L270,270 L262,285 L254,278 L250,258 L252,238 Z"
    />

    {/* Repère Sénégal (pointe ouest du continent) */}
    <g className="africaMap__pin" transform="translate(18, 122)">
      <circle className="africaMap__pinPulse" r="14" />
      <circle className="africaMap__pinDot" r="5" />
      <text className="africaMap__pinLabel" x="14" y="-10">Sénégal</text>
    </g>
  </svg>
);

export default AfricaSenegalMap;
