import { callMockBlogAPI } from '../../scripts/mockapi.js';
import { readBlockConfig } from '../../scripts/aem.js';
import { addIcon } from '../../scripts/blocks-utils.js';

function createBlogCard(blogData) {
  const ImageSrc = blogData.imageUrl;
  const articleUrl = blogData.link;
  const articleTitle = blogData.title;
  const articleDesc = blogData.description;
  const articleDate = blogData.postDate;

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
  const articleInfo = document.createElement('div');
  articleInfo.className = 'article-info';

  addIcon(articleInfo, 'time', '', 'time');
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

async function generateCardsView(carouselTrack) {
  const blogsDataArray = await callMockBlogAPI();
  const entriesToProcess = blogsDataArray.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i + 1 < entriesToProcess; i += 2) {
    const carouselCard = document.createElement('div');
    carouselCard.className = 'carousel-card';
    carouselCard.appendChild(createBlogCard(blogsDataArray[i]));
    carouselCard.appendChild(createBlogCard(blogsDataArray[i + 1]));
    carouselTrack.appendChild(carouselCard);
  }
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
  const blockConfig = readBlockConfig(block);
  block.textContent = '';
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row border-wrapper';
  const titleDiv = document.createElement('div');
  titleDiv.className = 'title text-center';

  const titleText = document.createElement('h2');
  titleText.textContent = blockConfig.title;
  titleDiv.appendChild(titleText);
  rowDiv.appendChild(titleDiv);

  const carouselBody = document.createElement('div');
  carouselBody.className = 'carousel-body';

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
  const discoverLink = blockConfig.discoverlink;
  addDiscoverLink(rowDiv, discoverLink);
  block.appendChild(rowDiv);
}
