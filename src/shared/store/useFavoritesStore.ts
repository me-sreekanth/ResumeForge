import { create } from 'zustand';

type FavoritesState = {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
};

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: [],
  addFavorite: (id) =>
    set((state) => ({
      favorites: [...state.favorites, id]
    })),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav !== id)
    }))
}));
