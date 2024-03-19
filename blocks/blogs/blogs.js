function createBlogCard() {
  const ImageId = 'Blog-202306051107590806957.jpg';
  const ImageSrc = `https://www.icicidirect.com/images/${ImageId}`;
  const articleId = 'healthy-volume-prints-in-may-2023';
  const articleUrl = `https://www.icicidirect.com/research/equity/one-minutes-read/${articleId}`;
  const articleTitle = 'Healthy volume prints in May 2023; 2-W space outshines!';
  const articleDesc = 'Overall wholesale volume prints for May 2023 came in steady with a sequential recovery witnessed almost across all segments.';
  const articleDate = '07-JUN-2023 09:00';

  const arcticleDiv = document.createElement('div');
  arcticleDiv.className = 'article';
  const pictureWrapper = document.createElement('div');
  pictureWrapper.className = 'picture-wrapper';

  const articlePicture = document.createElement('picture');
  const articleImg = document.createElement('img');
  articleImg.src = ImageSrc;
  articleImg.alt = '';
  articleImg.loading = 'lazy';
  articlePicture.appendChild(articleImg);
  pictureWrapper.appendChild(articlePicture);
  arcticleDiv.appendChild(pictureWrapper);
  const articleContent = document.createElement('div');
  articleContent.className = 'article-content';
  const articleTitleDiv = document.createElement('h3');

  const articleLink = document.createElement('a');
  articleLink.href = articleUrl;
  articleLink.textContent = articleTitle;
  articleLink.target = '_blank';
  articleTitleDiv.appendChild(articleLink);
  articleContent.appendChild(articleTitleDiv);

  const articleText = document.createElement('div');
  articleText.className = 'article-text';

  const articleTextP = document.createElement('span');
  articleTextP.textContent = articleDesc;
  articleText.appendChild(articleTextP);
  articleContent.appendChild(articleText);
  //
  const articleInfo = document.createElement('div');
  articleInfo.className = 'article-info';

  const iconImg = document.createElement('img');
  iconImg.src = 'https://www.icicidirect.com/Content/images/time.svg';
  iconImg.alt = 'time';
  iconImg.loading = 'lazy';
  articleInfo.appendChild(iconImg);
  const articleInfoTime = document.createElement('span');
  articleInfoTime.textContent = articleDate;
  articleInfo.appendChild(articleInfoTime);

  const articleInfoPoweredBy = document.createElement('span');
  articleInfoPoweredBy.textContent = 'ICICI Securities';
  articleInfo.appendChild(articleInfoPoweredBy);
  articleContent.appendChild(articleInfo);

  arcticleDiv.appendChild(articleContent);
  return arcticleDiv;
}

function createCaroselCard() {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'carousel-card';
  cardDiv.appendChild(createBlogCard());
  cardDiv.appendChild(createBlogCard());
  return cardDiv;
}
async function generateCardsView(carouselTrack) {
  carouselTrack.appendChild(createCaroselCard());
  carouselTrack.appendChild(createCaroselCard());
  carouselTrack.appendChild(createCaroselCard());
  carouselTrack.appendChild(createCaroselCard());
  carouselTrack.appendChild(createCaroselCard());
}

function addDiscoverLink(carouselBody, discoverLink) {
  if (discoverLink) {
    const div = document.createElement('div');
    div.className = 'text-center discover-more';
    const anchor = document.createElement('a');
    anchor.href = discoverLink; // Set the href to your discoverLink variable
    anchor.className = 'link-color';
    anchor.target = '_blank'; // Ensures the link opens in a new tab
    anchor.textContent = 'Discover More '; // Add the text content
    const icon = document.createElement('i');
    icon.className = 'icon-up-arrow icon ';
    anchor.appendChild(icon);
    div.appendChild(anchor);
    carouselBody.appendChild(div);
  }
}
export default async function decorate(block) {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row border-wrapper';
  const titleDiv = document.createElement('div');
  titleDiv.className = 'title text-center';

  const titleText = document.createElement('h2');
  titleText.textContent = 'BLOGS';
  titleDiv.appendChild(titleText);
  rowDiv.appendChild(titleDiv);

  const carouselBody = document.createElement('div');
  carouselBody.className = 'carousel-body';
  // carouselContainer.appendChild(carouselBody);

  const carouselSlider = document.createElement('div');
  carouselSlider.className = 'carousel-slider';

  const carouselList = document.createElement('div');
  carouselList.classList.add('carousel-list');
  carouselSlider.appendChild(carouselList);
  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('carousel-track');
  generateCardsView(carouselTrack);
  carouselList.appendChild(carouselTrack);
  carouselBody.appendChild(carouselSlider);
  rowDiv.appendChild(carouselBody);
  const discoverLink = 'https://www.icicidirect.com/research/equity/blog';
  addDiscoverLink(rowDiv, discoverLink);
  block.appendChild(rowDiv);
}
