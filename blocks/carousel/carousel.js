import { readBlockConfig } from '../../scripts/aem.js';
import { fetchRecommendations, getMarginActionUrl, mockPredicationConstant } from '../../scripts/mockapi.js';

function updateCarouselView(dotIndex, cardsToShow) {
  const slickTrack = document.querySelector('.slick-track');
  const totalCards = slickTrack.children.length; // Total number of cards
  const cardWidth = slickTrack.children[0].offsetWidth; // Width of a single card

  // Calculate the new transform distance
  const moveDistance = dotIndex * cardWidth; // Move one card width per dot

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < totalCards; i++) {
    if (i >= dotIndex && i < dotIndex + cardsToShow) {
      slickTrack.children[i].style.opacity = 1; // Show the cards in the current view
    } else {
      slickTrack.children[i].style.opacity = 0; // Hide other cards
    }
  }
  // Apply the transform to slide
  slickTrack.style.transform = `translateX(-${moveDistance}px)`;
}
function updateActiveDot(activeIndex, dots) {
  // Remove active class from all dots
  dots.forEach((dot) => dot.classList.remove('active'));
  // Add active class to the currently active dot
  dots[activeIndex].classList.add('active');
}
function setCarouselView(type, researchSlider) {
  const slickTrack = researchSlider.querySelector('.slick-track');
  // const researchSlider = document.querySelector('.researchSlider');

  const cards = Array.from(slickTrack.children);
  cards.forEach((card) => { card.style.opacity = '0'; });
  const maxWidth = slickTrack.offsetWidth;
  let currentWidth = 0;
  let totalCardDisplayed = 0;
  let numberOfDots = 1;
  let dotContainerNeeded = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cards.length; i++) {
    if (currentWidth + cards[i].offsetWidth < maxWidth) {
      currentWidth += cards[i].offsetWidth;
      cards[i].style.opacity = '1';
      totalCardDisplayed += 1;
    } else {
      dotContainerNeeded = true;
      numberOfDots += 1;
    }
  }
  if (dotContainerNeeded) {
    let dotsContainer = researchSlider.querySelector('.dots-container');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
    } else {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'dots-container border-box';
    }
    researchSlider.appendChild(dotsContainer);
    const dots = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numberOfDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot border-box';
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
      dots.push(dot);

      dot.addEventListener('click', function () {
        updateCarouselView(parseInt(this.dataset.index, 10), totalCardDisplayed);
        updateActiveDot(parseInt(this.dataset.index, 10), dots);
      });
    }
    // Initialize the first dot as active
    updateActiveDot(0, dots);
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
  button.onclick = function () {
    if (dropdownMenuContainer.style.display === 'block') {
      dropdownMenuContainer.style.display = 'none';
      return;
    }
    // Close all other dropdowns by querying them
    document.querySelectorAll('.dropdown-menu-container').forEach((container) => {
      container.style.display = 'none';
    });
    // Toggle the display of this dropdownMenuContainer
    dropdownMenuContainer.style.display = 'block';
  };

  return dropdownSelectDiv;
}
function generateHtmlForIdeasStrike(predicationHtml) {
  const div = document.createElement('div');
  div.className = 'ideas-strike border-box';
  const img = document.createElement('img');
  img.src = '../../icons/target.png';
  img.alt = 'target';

  const span = document.createElement('span');
  const p = document.createElement('p');
  p.innerHTML = predicationHtml;
  span.appendChild(p);

  div.appendChild(img);
  div.appendChild(span);
  div.appendChild(img.cloneNode(true));

  return div;
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

function createValueContent(row, labelText, valueText) {
  const colDiv = document.createElement('div');
  colDiv.className = 'value-col col border-box';
  const valueContentDiv = document.createElement('div');
  valueContentDiv.className = 'value-content border-box';
  const label = document.createElement('label');
  label.textContent = labelText;
  const h5 = document.createElement('h5');
  h5.className = 'label-value border-box';
  h5.innerHTML = valueText; // Using innerHTML to include <span> if necessary
  valueContentDiv.appendChild(label);
  valueContentDiv.appendChild(h5);
  colDiv.appendChild(valueContentDiv);
  row.appendChild(colDiv);
}

function createProfitContent(row, labelText, valueText) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col border-box';
  const valueContentDiv = document.createElement('div');
  valueContentDiv.className = 'value-content field-content border-box';
  const h5 = document.createElement('h5');
  h5.className = 'label-value border-box';
  h5.innerHTML = valueText; // Using innerHTML to include <span> if necessary
  if (valueText.includes('-')) {
    h5.classList.add('negative');
  } else {
    h5.classList.add('positive');
  }
  const label = document.createElement('label');
  label.textContent = labelText;
  valueContentDiv.appendChild(h5);
  valueContentDiv.appendChild(label);
  colDiv.appendChild(valueContentDiv);
  row.appendChild(colDiv);
}

function createReturnContent(row, labelText, valueText) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col border-box';
  const valueContentDiv = document.createElement('div');
  valueContentDiv.className = 'value-content field-content border-box';
  const label = document.createElement('label');
  label.textContent = labelText;
  const h5 = document.createElement('h5');
  h5.className = 'label-value border-box';
  h5.innerHTML = valueText; // Using innerHTML to include <span> if necessary
  if (valueText.includes('-')) {
    h5.classList.add('negative');
  } else {
    h5.classList.add('positive');
  }
  valueContentDiv.appendChild(h5);
  valueContentDiv.appendChild(label);
  colDiv.appendChild(valueContentDiv);
  row.appendChild(colDiv);
}

function getRow(company) {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row border-box';
  if (company.recoPrice) {
    createValueContent(rowDiv, mockPredicationConstant.recoPrice, company.recoPrice);
  }
  if (company.profitPotential) {
    createProfitContent(rowDiv, mockPredicationConstant.profitPotential, company.profitPotential);
  }

  if (company.buyingRange) {
    createValueContent(rowDiv, mockPredicationConstant.buyingRange, company.buyingRange);
  }

  if (company.returns) {
    createReturnContent(rowDiv, mockPredicationConstant.returns, company.returns);
  }
  if (company.cmp) {
    createValueContent(rowDiv, mockPredicationConstant.cmp, `<span class="icon-rupee"></span>${company.cmp}`);
  }

  if (company.minAmount) {
    createValueContent(rowDiv, mockPredicationConstant.minAmount, `<span class="icon-rupee"></span>${company.minAmount}`);
  }
  if (company.targetPrice) {
    createValueContent(rowDiv, mockPredicationConstant.targetPrice, `<span class="icon-rupee"></span>${company.targetPrice}`);
  }
  if (company.riskProfile) {
    createValueContent(rowDiv, mockPredicationConstant.riskProfile, company.riskProfile);
  }

  if (company.stopLoss) {
    createValueContent(rowDiv, mockPredicationConstant.stopLoss, `<span class="icon-rupee"></span>${company.stopLoss}`);
  }
  return rowDiv;
}

function getTradingCard(companies, type) {
  return companies.map((company) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slick-slide border-box';
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

    slideDiv.appendChild(boxDiv);
    return slideDiv;
  });
}

function generateDiscoverMoreElement(discoverLink) {
  const div = document.createElement('div');
  div.className = 'mt-3 text-md-right text-center discover-more border-box';
  const anchor = document.createElement('a');
  anchor.href = discoverLink; // Set the href to your discoverLink variable
  anchor.className = 'link-color';
  anchor.target = '_blank'; // Ensures the link opens in a new tab
  anchor.textContent = 'Discover More '; // Add the text content
  const icon = document.createElement('i');
  icon.className = 'icon-up-arrow icon ';
  anchor.appendChild(icon);
  div.appendChild(anchor);
  return div;
}

async function generateCardsView(type, slickTrack, researchSlider) {
  fetchRecommendations(type).then((companies) => {
    if (companies) {
      const htmlElementsArray = getTradingCard(companies, type);
      htmlElementsArray.forEach((div) => {
        slickTrack.appendChild(div);
      });
      setCarouselView(type, researchSlider);
    }
  });
}

export default function decorate(block) {
  const blockConfig = readBlockConfig(block);
  const { type } = blockConfig;
  const { title } = blockConfig;
  const predicationDiv = block.querySelector('.predication');
  const discoverLink = blockConfig.discoverlink;
  // eslint-disable-next-line no-nested-ternary
  const dropdowns = !blockConfig.dropdown ? undefined
    : Array.isArray(blockConfig.dropdown) ? blockConfig.dropdown : [blockConfig.dropdown];
  block.textContent = '';

  const explorerSection = document.createElement('div');
  explorerSection.classList.add('explore-section');
  block.appendChild(explorerSection);

  if (predicationDiv) {
    explorerSection.appendChild(generateHtmlForIdeasStrike(predicationDiv.innerHTML));
  }
  const explorerContainer = document.createElement('div');
  explorerContainer.className = 'explore-container border-box';
  explorerSection.appendChild(explorerContainer);

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

  const explorerBody = document.createElement('div');
  explorerBody.className = 'explore-body border-box';
  explorerContainer.appendChild(explorerBody);

  const researchSlider = document.createElement('div');
  researchSlider.classList.add('research-slider');
  researchSlider.classList.add('slick-initialized');
  researchSlider.classList.add('slick-slider');
  researchSlider.classList.add('slick-dotted');
  researchSlider.classList.add('carousel');
  researchSlider.classList.add('border-box');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list');
  slickList.classList.add('draggable');
  researchSlider.appendChild(slickList);
  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.appendChild(slickTrack);
  explorerBody.appendChild(researchSlider);

  generateCardsView(type, slickTrack, researchSlider);

  if (discoverLink) {
    explorerBody.appendChild(generateDiscoverMoreElement(discoverLink));
  }

  window.addEventListener('resize', setCarouselView(type, researchSlider));
}
