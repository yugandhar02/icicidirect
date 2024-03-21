import { getTrendingNews } from '../../scripts/mockapi.js';
import { Viewport } from '../../scripts/blocks-utils.js';
import { decorateIcons } from '../../scripts/aem.js';

function createDiscoverMore() {
  const discoverMore = document.createElement('div');
  discoverMore.className = 'discover-more text-right';

  const link = document.createElement('a');
  link.href = 'https://www.icicidirect.com/research/equity/trending-news';
  link.className = 'link-color';
  link.target = '_blank';
  link.textContent = 'Discover More ';
  const icon = document.createElement('i');
  icon.className = 'icon-up-arrow icon';
  link.appendChild(icon);
  discoverMore.appendChild(link);
  return discoverMore;
}

function createNewsCards(news) {
  const article = document.createElement('div');
  article.className = 'article';

  const mediaWrapper = document.createElement('div');
  mediaWrapper.className = 'picture-wrapper';

  const picture = document.createElement('picture');

  const img = document.createElement('img');
  img.src = news.imgUrl;
  img.alt = '';
  img.loading = 'lazy';
  picture.appendChild(img);
  mediaWrapper.appendChild(picture);

  const textContent = document.createElement('div');
  textContent.className = 'article-text';

  const h3 = document.createElement('h3');
  h3.className = 'post-title';
  const a = document.createElement('a');
  a.href = news.link;
  a.target = '_blank';
  a.tabIndex = '0';
  a.textContent = news.title;
  h3.appendChild(a);
  textContent.appendChild(h3);

  const postMeta = document.createElement('div');
  postMeta.className = 'post-info';
  const iconSpan = document.createElement('span');
  iconSpan.className = 'icon icon-icon-time';
  const abbr = document.createElement('abbr');
  abbr.textContent = `${news.date} `;
  const abbrSource = document.createElement('abbr');
  abbrSource.textContent = news.source;
  postMeta.appendChild(iconSpan);
  postMeta.appendChild(abbr);
  postMeta.appendChild(abbrSource);
  decorateIcons(postMeta);
  textContent.appendChild(postMeta);

  const description = document.createElement('div');
  description.className = 'descriptn articleDesc';
  textContent.appendChild(description);

  article.appendChild(mediaWrapper);
  article.appendChild(textContent);

  return article;
}

export default function decorate(block) {
  const newsData = getTrendingNews();
  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'container';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'title text-center';
  const h2 = document.createElement('h2');
  h2.textContent = 'TRENDING NEWS';
  titleWrap.appendChild(h2);
  container.appendChild(titleWrap);

  const newsSection = document.createElement('div');
  newsSection.className = 'news-section';

  const slider = document.createElement('div');
  slider.className = 'news-slider';

  const slickListDragable = document.createElement('div');
  slickListDragable.className = 'news-list';

  const slickTrack = document.createElement('div');
  slickTrack.className = 'news-track';

  newsData.forEach((news) => {
    const slide = document.createElement('div');
    slide.className = 'news-card';
    const article = createNewsCards(news);
    slide.appendChild(article);
    slickTrack.appendChild(slide);
  });

  slickListDragable.appendChild(slickTrack);
  slider.appendChild(slickListDragable);
  newsSection.appendChild(slider);
  newsSection.appendChild(createDiscoverMore());
  container.appendChild(newsSection);

  block.appendChild(container);
}

function allowedCardsCount() {
  const deviceType = Viewport.getDeviceType();
  switch (deviceType) {
    case 'Desktop':
      return 4;
    case 'Tablet':
      return 2;
    default:
      return 1;
  }
}

let currentIndex = 0;
let shift = 0;
const intervalId = setInterval(() => {
  const cards = document.getElementsByClassName('news-track')[0].children;
  const cardSize = document.getElementsByClassName('news-card')[0].offsetWidth;
  const offset = allowedCardsCount();

  if (offset >= 4) {
    document.getElementsByClassName('news-track')[0].style.transform = 'translateX(0px)';
    clearInterval(intervalId);
  }

  if (currentIndex >= cards.length) currentIndex = 0;
  if ((shift === 0 || shift !== allowedCardsCount()) && !(shift < 0)) {
    currentIndex = 0;
    shift = allowedCardsCount();
  }
  if (currentIndex === cards.length - offset && shift > 0) {
    shift = -shift; // Change direction when reaching the end
  } else if (currentIndex === 0 && shift < 0) {
    shift = -shift; // Change direction when reaching the beginning
  }
  currentIndex += shift;
  const moveDistance = currentIndex * (cardSize);
  document.getElementsByClassName('news-track')[0].style.transform = `translateX(-${moveDistance}px)`;
}, 3000);
