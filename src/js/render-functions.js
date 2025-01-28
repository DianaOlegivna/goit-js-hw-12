export const createGalleryCardTemplate = imgInfo => {
  return `
      <a class="gallery-item" href="${imgInfo.largeImageURL}">
        <div class="photo-card">
          <img src="${imgInfo.webformatURL}" alt="${imgInfo.tags}" loading="lazy" />
          <div class="info">
            <p><b>Likes:</b> ${imgInfo.likes}</p>
            <p><b>Views:</b> ${imgInfo.views}</p>
            <p><b>Comments:</b> ${imgInfo.comments}</p>
            <p><b>Downloads:</b> ${imgInfo.downloads}</p>
          </div>
        </div>
        </a>`;
};


