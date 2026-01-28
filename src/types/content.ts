export type AnimeId = number;

export type AnimeStaffMember = {
  role: string;
  name: string;
};

export type AnimeCharacter = {
  name: string;
  role: string;
  voice: string;
};

export type AnimeWatchLink = {
  platform: string;
  url: string;
};

export type AnimeReview = {
  user: string;
  rating: number;
  comment: string;
};

export type Anime = {
  id: AnimeId;
  title: string;
  originalTitle: string;
  cover: string;
  type: string;
  releaseYear: number;
  status: string;
  episodes: number;
  rating: number;
  studio: string;
  description: string;
  tags: string[];
  popularity: number;
  trailer: string;
  staff: AnimeStaffMember[];
  characters: AnimeCharacter[];
  relatedAnime: AnimeId[];
  watchLinks: AnimeWatchLink[];
  reviews: AnimeReview[];
};

export type Category = {
  id: number;
  name: string;
};

export type NewsItem = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string[];
};
