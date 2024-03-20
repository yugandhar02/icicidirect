import { getTrendingNews } from '../../scripts/mockapi.js';

export default function decorate(block) {
  const newsData = getTrendingNews();
  block.textContent = '';

  function createNewsItem(news) {
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
    h3.className = 'post_title';
    const a = document.createElement('a');
    a.href = news.link;
    a.target = '_blank';
    a.tabIndex = '0';
    a.textContent = news.title;
    h3.appendChild(a);
    textContent.appendChild(h3);

    const postMeta = document.createElement('div');
    postMeta.className = 'post-info';
    const imgTime = document.createElement('img');
    imgTime.src = 'https://www.icicidirect.com/Content/images/time.svg';
    imgTime.alt = 'time';
    imgTime.loading = 'lazy';
    const abbr = document.createElement('abbr');
    abbr.textContent = `${news.date} `;
    const abbrSource = document.createElement('abbr');
    abbrSource.textContent = news.source;
    postMeta.appendChild(imgTime);
    postMeta.appendChild(abbr);
    postMeta.appendChild(abbrSource);
    textContent.appendChild(postMeta);

    const description = document.createElement('div');
    description.className = 'descriptn articleDesc';
    description.id = `divtrendingStock_${Math.floor(Math.random() * 10000000000)}`;
    textContent.appendChild(description);

    article.appendChild(mediaWrapper);
    article.appendChild(textContent);

    return article;
  }

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
    const article = createNewsItem(news);
    slide.appendChild(article);
    slickTrack.appendChild(slide);
  });

  slickListDragable.appendChild(slickTrack);
  slider.appendChild(slickListDragable);
  newsSection.appendChild(slider);

  // Discover more link
  const link = document.createElement('a');
  link.href = 'https://www.icicidirect.com/research/equity/trending-news';
  link.className = 'link-color';
  link.target = '_blank';
  link.textContent = 'Discover More ';
  const icon = document.createElement('i');
  icon.className = 'icon-up-arrow icon';
  link.appendChild(icon);
  const discoverMore = document.createElement('div');
  discoverMore.className = 'discover-more text-right';
  discoverMore.appendChild(link);
  newsSection.appendChild(discoverMore);

  container.appendChild(newsSection);

  // Appending container to the body
  block.appendChild(container);
}
