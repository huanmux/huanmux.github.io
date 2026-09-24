export interface AppItem {
  id: string;
  name: string;
  icon: string;
  url: string;
  domain: string;
  tagline: string;
  category: string;
}

export type ThemeId =
  | 'classic-dark'
  | 'classic-light'
  | 'spring-blossom'
  | 'summer-splash'
  | 'falling-leaves'
  | 'frosty-flakes'
  | 'cozy-christmas'
  | 'holy-ramadan'
  | 'canada-day'
  | 'starry-skies';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  mode: 'light' | 'dark';
  accent: string;
  bgPreview: string;
  borderPreview: string;
  description: string;
}
