export type MoviePreview = {
  id: string;
  cover: string;
};

export type Movie = {
  id: string;
  title: string;
  overview: string;
  cover: string;
  banner?: string;
  genre: string[];
  tags: string[];
  duration: string;
  runtime: string;
  year: string;
  rating: string;
  director: string;
  cast: string[];
  related: MoviePreview[];
};
