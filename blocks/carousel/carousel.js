import { readBlockConfig } from '../../scripts/aem.js';
import { fetchRecommendations, getMarginActionUrl, mockPredicationConstant } from '../../scripts/mockapi.js';
import { Viewport } from '../../scripts/blocks-utils.js';

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
function updateCarouselView(activeDot) {
  const dotIndex = parseInt(activeDot.dataset.index, 10);
  const researchSlider = activeDot.closest('.research-slider');
  const dots = researchSlider.querySelectorAll('.dot');
  const currentActiveDot = researchSlider.querySelector('.dot.active');
  if (currentActiveDot && currentActiveDot.dataset.index === activeDot.dataset.index) {
    return;
  }
  const carouselTrack = researchSlider.querySelector('.carousel-track');
  const widthAvailable = carouselTrack.offsetWidth;
  const allowedCards = allowedCardsCount();
  const cardWidth = widthAvailable / allowedCards;
  const cards = Array.from(carouselTrack.children);
  cards.forEach((card, index) => {
    if (index >= dotIndex && index < dotIndex + allowedCards) {
      card.style.opacity = 1;
    } else {
      card.style.opacity = 0;
    }
    card.style.width = `${cardWidth}px`;
  });
  const moveDistance = dotIndex * cards[0].offsetWidth;
  carouselTrack.style.transform = `translateX(-${moveDistance}px)`;
  dots.forEach((dot) => dot.classList.remove('active'));
  dots[dotIndex].classList.add('active');
}

function startUpdateCarousel(researchSlider) {
  const dotsContainer = researchSlider.querySelector('.dots-container');
  if (!dotsContainer) return; // Exit if dotsContainer doesn't exist

  const dots = dotsContainer.querySelectorAll('.dot');
  let activeDotIndex = Array.from(dots).findIndex((dot) => dot.classList.contains('active'));

  if (activeDotIndex === -1) {
    return;
  }

  const isDesktop = Viewport.isDesktop();
  let movingForward = true;

  const intervalId = setInterval(() => {
    if (isDesktop) {
      if (activeDotIndex === dots.length - 1) {
        clearInterval(intervalId); // Stop if it's desktop and reaches the last dot
        return;
      }
      activeDotIndex = (activeDotIndex + 1) % dots.length; // Move to the next dot
    } else {
      if (activeDotIndex === 0) {
        movingForward = true; // Switch to moving forward
      } else if (activeDotIndex === dots.length - 1) {
        movingForward = false; // Switch to moving in reverse
      }
      activeDotIndex = movingForward ? (activeDotIndex + 1) % dots.length : activeDotIndex - 1;
      if (activeDotIndex < 0) {
        activeDotIndex = dots.length - 1;
      }
    }
    const activeDot = dots[activeDotIndex];
    updateCarouselView(activeDot);
  }, 2000);
}

function setCarouselView(type, researchSlider) {
  const carouselTrack = researchSlider.querySelector('.carousel-track');
  const cards = Array.from(carouselTrack.children);
  const visibleCards = allowedCardsCount();
  const numberOfDots = cards.length - visibleCards + 1;
  if (numberOfDots > 1) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'dots-container border-box';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numberOfDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot border-box';
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
      dot.addEventListener('click', function updateCarouselOnClick() {
        updateCarouselView(this);
      });
    }

    researchSlider.appendChild(dotsContainer);
    updateCarouselView(dotsContainer.firstChild);
    startUpdateCarousel(researchSlider);
  }
}

function createDropdown(dropdownValue) {
  const menuItems = dropdownValue.split(', ');
  const dropdownText = menuItems[0];

  const dropdownSelectDiv = document.createElement('div');
  dropdownSelectDiv.className = 'dropdown-select border-box';

  const button = document.createElement('button');
  button.className = 'dropdown-toggle border-box';
  button.innerHTML = `<span class="dropdown-text">${dropdownText}</span><span class="icon-down-arrow icon"></span>`;

  const dropdownMenuContainer = document.createElement('div');
  dropdownMenuContainer.className = 'dropdown-menu-container border-box';

  const ul = document.createElement('ul');
  ul.className = 'dropdown-menu border-box';

  menuItems.forEach((itemText) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const span = document.createElement('span');
    span.textContent = itemText;
    a.appendChild(span);
    li.appendChild(a);
    ul.appendChild(li);
  });

  dropdownMenuContainer.appendChild(ul);
  dropdownSelectDiv.appendChild(button);
  dropdownSelectDiv.appendChild(dropdownMenuContainer);
  button.addEventListener('click', () => {
    if (dropdownMenuContainer.style.display === 'block') {
      dropdownMenuContainer.style.display = 'none';
      return;
    }
    document.querySelectorAll('.dropdown-menu-container').forEach((container) => {
      container.style.display = 'none';
    });
    // Toggle the display of this dropdownMenuContainer
    dropdownMenuContainer.style.display = 'block';
  });

  return dropdownSelectDiv;
}

function createIconLink(iconWrap, src) {
  const a = document.createElement('a');
  a.href = '#';
  a.tabIndex = 0;
  const img = document.createElement('img');
  img.src = src;
  a.appendChild(img);
  iconWrap.appendChild(a);
}

function companyCardHeader(company) {
  const headingWrap = document.createElement('div');
  headingWrap.className = 'heading-wrap border-box';

  const h4 = document.createElement('h4');
  h4.title = company.name;
  h4.textContent = company.name;
  headingWrap.appendChild(h4);

  const iconWrap = document.createElement('div');
  iconWrap.className = 'icon-wrap';

  createIconLink(iconWrap, '../../icons/icon-bookmark.svg');
  createIconLink(iconWrap, '../../icons/icon-share-2.svg');

  headingWrap.appendChild(iconWrap);
  return headingWrap;
}

function addActionButton(boxFooter, company, type) {
  const { action } = company;
  const btnWrap = document.createElement('div');
  if (type === 'trading') {
    btnWrap.className = 'btn-wrap border-box';
  }
  const aSell = document.createElement('a');
  aSell.href = getMarginActionUrl(action.toLowerCase());
  aSell.className = `btn border-box btn-${action.toLowerCase()}`;
  if (company.exit) {
    aSell.classList.add('disabled');
  }
  aSell.target = '_blank';
  aSell.tabIndex = 0;
  aSell.textContent = `${action}`;
  btnWrap.appendChild(aSell);
  boxFooter.appendChild(btnWrap);
}

function addFooterLabel(boxFooter, company, type) {
  if (type !== 'trading') {
    return;
  }
  const footerLabel = document.createElement('div');
  footerLabel.className = 'footer-label border-box';
  if (!company.exit) {
    footerLabel.classList.add('disable');
  }
  const label = document.createElement('label');
  label.textContent = mockPredicationConstant.profitExit;
  footerLabel.appendChild(label);
  const span = document.createElement('span');
  span.className = 'label-value';
  span.textContent = company.exit;
  footerLabel.appendChild(span);
  boxFooter.appendChild(footerLabel);
}

function addReportLink(boxFooter, company) {
  if (company.reportLink) {
    const reportWrap = document.createElement('div');
    reportWrap.classList.add('border-box');
    const reportLinl = document.createElement('a');
    reportLinl.href = 'https://www.icicidirect.com/mailimages/IDirect_MahindraMahindra_CoUpdate_Feb24.pdf';
    reportLinl.className = 'link-color';
    reportLinl.target = '_blank';
    reportLinl.textContent = 'View Report';
    reportWrap.appendChild(reportLinl);
    boxFooter.appendChild(reportWrap);
  }
}

function createValueContent(row, labelText, valueText, colType = 'value') {
  const colDiv = document.createElement('div');
  const valueContentDiv = document.createElement('div');
  const label = document.createElement('label');
  const h5 = document.createElement('h5');

  colDiv.className = 'value-col col border-box';
  valueContentDiv.className = 'value-content border-box';
  if (colType !== 'value') {
    valueContentDiv.classList.add('field-content');
  }

  label.textContent = labelText;
  h5.className = 'label-value border-box';
  h5.innerHTML = valueText; // Using innerHTML to include <span> if necessary

  // Adding 'negative' or 'positive' class based on valueText for 'profit' and 'return'
  if (colType !== 'value' && valueText.includes('-')) {
    h5.classList.add('negative');
  } else if (colType !== 'value') {
    h5.classList.add('positive');
  }

  if (colType === 'profit') { // Clearing existing children
    valueContentDiv.appendChild(h5);
    valueContentDiv.appendChild(label);
  } else {
    valueContentDiv.appendChild(label);
    valueContentDiv.appendChild(h5);
  }

  colDiv.appendChild(valueContentDiv);
  row.appendChild(colDiv);
}

function getRow(company) {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row border-box';

  const contentData = [
    { label: mockPredicationConstant.recoPrice, value: company.recoPrice },
    { label: mockPredicationConstant.profitPotential, value: company.profitPotential, type: 'profit' },
    { label: mockPredicationConstant.buyingRange, value: company.buyingRange },
    { label: mockPredicationConstant.returns, value: company.returns, type: 'return' },
    { label: mockPredicationConstant.cmp, value: company.cmp ? `<span class="icon icon-rupee"></span>${company.cmp}` : '' },
    { label: mockPredicationConstant.minAmount, value: company.minAmount ? `<span class="icon icon-rupee"></span>${company.minAmount}` : '' },
    { label: mockPredicationConstant.targetPrice, value: company.targetPrice ? `<span class="icon icon-rupee"></span>${company.targetPrice}` : '' },
    { label: mockPredicationConstant.riskProfile, value: company.riskProfile },
    { label: mockPredicationConstant.stopLoss, value: company.stopLoss ? `<span class="icon icon-rupee"></span>${company.stopLoss}` : '' },
  ];

  contentData.forEach((data) => {
    if (data.value) {
      createValueContent(rowDiv, data.label, data.value, data.type);
    }
  });

  return rowDiv;
}

function getRecommendationsCard(companies, type) {
  return companies.map((company) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'carousel-card border-box';
    const boxDiv = document.createElement('div');
    boxDiv.className = 'box border-box';
    if (type === 'trading') {
      boxDiv.classList.add('box-theme');
    }

    boxDiv.appendChild(companyCardHeader(company));

    const rowDiv = getRow(company);
    boxDiv.appendChild(rowDiv);

    const boxFooter = document.createElement('div');
    boxFooter.className = 'box-footer border-box';
    if (type === 'trading') {
      boxFooter.classList.add('box-footer-theme');
    } else if (type === 'oneclickportfolio') {
      boxFooter.classList.add('one-div');
    }

    addReportLink(boxFooter, company);
    addActionButton(boxFooter, company, type);
    addFooterLabel(boxFooter, company, type);

    boxDiv.appendChild(boxFooter);

    cardDiv.appendChild(boxDiv);
    return cardDiv;
  });
}

async function generateCardsView(type, carouselTrack, researchSlider) {
  fetchRecommendations(type).then((companies) => {
    if (companies) {
      const recommendationsCard = getRecommendationsCard(companies, type);
      recommendationsCard.forEach((div) => {
        carouselTrack.appendChild(div);
      });
      setCarouselView(type, researchSlider);
    }
  });
}

function addPredicationsSection(carouselSection, predicationDiv) {
  if (predicationDiv) {
    const div = document.createElement('div');
    div.className = 'ideas-strike border-box';
    const img = document.createElement('img');
    img.src = '../../icons/target.webp';
    img.alt = 'target';
    const span = document.createElement('span');
    const p = document.createElement('p');
    p.innerHTML = predicationDiv.innerHTML;
    span.appendChild(p);

    div.appendChild(img);
    div.appendChild(span);
    div.appendChild(img.cloneNode(true));
    carouselSection.appendChild(div);
  }
}

function addCarouselHeader(explorerContainer, title, dropdowns) {
  const explorerHeader = document.createElement('div');
  explorerHeader.className = 'explore-header border-box';
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row align-items-center border-box';
  const colDiv = document.createElement('div');
  colDiv.className = 'col carousel-title border-box';
  const heading = document.createElement('h3');
  heading.textContent = title;
  colDiv.appendChild(heading);

  rowDiv.appendChild(colDiv);

  if (dropdowns) {
    const dropdownsDiv = document.createElement('div');
    dropdownsDiv.className = 'dropdowns col border-box';
    dropdowns.forEach((dropdownValue) => {
      const dropDownEle = createDropdown(dropdownValue);
      dropdownsDiv.appendChild(dropDownEle);
    });
    rowDiv.appendChild(dropdownsDiv);
  }

  explorerHeader.appendChild(rowDiv);
  explorerContainer.appendChild(explorerHeader);
}

function addCarouselCards(explorerBody, type) {
  const researchSlider = document.createElement('div');
  researchSlider.className = 'research-slider carousel border-box';

  const carouselList = document.createElement('div');
  carouselList.classList.add('carousel-list');
  researchSlider.appendChild(carouselList);
  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('carousel-track');
  carouselList.appendChild(carouselTrack);
  explorerBody.appendChild(researchSlider);
  generateCardsView(type, carouselTrack, researchSlider);
}

function addDiscoverLink(explorerBody, discoverLink) {
  if (discoverLink) {
    const div = document.createElement('div');
    div.className = 'text-center discover-more border-box';
    const anchor = document.createElement('a');
    anchor.href = discoverLink; // Set the href to your discoverLink variable
    anchor.className = 'link-color';
    anchor.target = '_blank'; // Ensures the link opens in a new tab
    anchor.textContent = 'Discover More '; // Add the text content
    const icon = document.createElement('i');
    icon.className = 'icon-up-arrow icon ';
    anchor.appendChild(icon);
    div.appendChild(anchor);
    explorerBody.appendChild(div);
  }
}

function getPredicationDiv(block) {
  const predicationDiv = block.querySelectorAll(':scope > div')[2].children[1];
  return predicationDiv;
}
export default function decorate(block) {
  const blockConfig = readBlockConfig(block);
  const { type } = blockConfig;
  const { title } = blockConfig;
  const predicationDiv = getPredicationDiv(block);
  const discoverLink = blockConfig.discoverlink;
  const dropdowns = Array.isArray(blockConfig.dropdowns)
    ? blockConfig.dropdowns : [blockConfig.dropdowns].filter(Boolean);
  block.textContent = '';

  const carouselSection = document.createElement('div');
  carouselSection.classList.add('carousel-section');
  block.appendChild(carouselSection);

  addPredicationsSection(carouselSection, predicationDiv);

  const explorerContainer = document.createElement('div');
  explorerContainer.className = 'explore-container border-box';
  carouselSection.appendChild(explorerContainer);

  addCarouselHeader(explorerContainer, title, dropdowns);

  const explorerBody = document.createElement('div');
  explorerBody.className = 'explore-body border-box';
  explorerContainer.appendChild(explorerBody);

  addCarouselCards(explorerBody, type);
  addDiscoverLink(explorerBody, discoverLink);
}
