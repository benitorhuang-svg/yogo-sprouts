export function getFavorites(): number[] {
  const data = localStorage.getItem('yogo_favorites');
  return data ? JSON.parse(data) : [];
}

export function isFavorite(id: number): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: number): boolean {
  const favs = getFavorites();
  const index = favs.indexOf(id);
  let isFav = false;
  if (index > -1) {
    favs.splice(index, 1);
  } else {
    favs.push(id);
    isFav = true;
  }
  localStorage.setItem('yogo_favorites', JSON.stringify(favs));
  return isFav;
}
