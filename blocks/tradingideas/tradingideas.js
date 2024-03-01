import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    block.textContent = '';

    const explorerSection = document.createElement('div');
    explorerSection.classList.add('explore-section');
    block.appendChild(explorerSection);

    explorerSection.appendChild(generateHtmlForIdeasStrike());
    const explorerContainer = document.createElement('div');
    explorerContainer.className = 'explore-container';
    explorerSection.appendChild(explorerContainer);

    const explorerHeader     = document.createElement('div');
    explorerHeader.className = 'explore-header';
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row align-items-center';
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-6 col-4';
    const heading = document.createElement('h3');
    heading.textContent = 'TRADING IDEAS';
    colDiv.appendChild(heading);

    rowDiv.appendChild(colDiv);

    const dropdownsDiv = document.createElement('div');
    dropdownsDiv.className = 'dropdowns';
    const buyDropdown = createDropdown('Buy', ['Buy', 'Sell', 'Hold']);
    const intradayDropdown = createDropdown('Intraday', ['Intraday', 'All']);

    dropdownsDiv.appendChild(buyDropdown);
    dropdownsDiv.appendChild(intradayDropdown);
    rowDiv.appendChild(dropdownsDiv);
    explorerHeader.appendChild(rowDiv);
    explorerContainer.appendChild(explorerHeader);


    const explorerBody     = document.createElement('div');
    explorerBody.className = 'explore-body';
    explorerContainer.appendChild(explorerBody);

    const researchSlider     = document.createElement('div');
    researchSlider.classList.add('researchSlider');
    researchSlider.classList.add('slick-initialized');
    researchSlider.classList.add('slick-slider');
    researchSlider.classList.add('slick-dotted');
    researchSlider.classList.add('carousel');

    const slickList     = document.createElement('div');
    slickList.classList.add('slick-list');
    slickList.classList.add('draggable');
    researchSlider.appendChild(slickList);
    const slickTrack     = document.createElement('div');
    slickTrack.classList.add('slick-track');
    slickList.appendChild(slickTrack);
    explorerBody.appendChild(researchSlider);

    fetchAndProcessCompaniesData().then(companies => {
        if (companies) {
            const htmlElementsArray = generateHtmlForCompanyCard(companies);
            htmlElementsArray.forEach((htmlString, index) => {
                const div = document.createElement('div');
                div.innerHTML = htmlString;
                const element = div.firstElementChild;
             //   element.style.opacity = '0'; // Default all to 'none' initially
                slickTrack.appendChild(element);
            });

            setCarouselView();
        }

    });
    explorerBody.appendChild(generateDiscoverMoreElement());
    window.addEventListener('resize', setCarouselView);

}

function setCarouselView() {
    const slickTrack = document.querySelector('.slick-track');
    const researchSlider = document.querySelector('.researchSlider');

    const cards = Array.from(slickTrack.children);
    cards.forEach(card => {card.style.opacity = '0';});
    const maxWidth =slickTrack.offsetWidth;
    let currentWidth = 0;
    let totalCardDisplayed = 0;
    let numberOfDots = 1;
    for (let i = 0; i < cards.length; i++) {
        if (currentWidth + cards[i].offsetWidth < maxWidth) {
            currentWidth = currentWidth + cards[i].offsetWidth;
            cards[i].style.opacity = '1';
            totalCardDisplayed = totalCardDisplayed + 1;
        } else {
            numberOfDots = numberOfDots + 1;
        }
    }
    // Dot Navigation
    let dotsContainer = document.querySelector('.dots-container');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
    } else {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'dots-container';
    }
    researchSlider.appendChild(dotsContainer);
    const dots = [];

    for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
        dots.push(dot);

        dot.addEventListener('click', function() {
            updateCarouselView(parseInt(this.dataset.index), totalCardDisplayed);
            updateActiveDot(parseInt(this.dataset.index), dots);
        });
    }
    // Initialize the first dot as active
    updateActiveDot(0, dots);

}

function updateCarouselView(dotIndex, cardsToShow) {
    const slickTrack = document.querySelector('.slick-track');
    const totalCards = slickTrack.children.length; // Total number of cards
    const cardWidth = slickTrack.children[0].offsetWidth; // Width of a single card

    // Calculate the new transform distance
    const moveDistance = dotIndex * cardWidth; // Move one card width per dot

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
    dots.forEach(dot => dot.classList.remove('active'));
    // Add active class to the currently active dot
    dots[activeIndex].classList.add('active');

}

function createDropdown(dropdownText, menuItems) {
    const dropdownSelectDiv = document.createElement('div');
    dropdownSelectDiv.className = 'dropdown-select';

    const button = document.createElement('button');
    button.className = 'dropdown-toggle';
    button.innerHTML = `<span class="dropdown-text">${dropdownText}</span><span class="icon-down-arrow icon"></span>`;

    const dropdownMenuContainer = document.createElement('div');
    dropdownMenuContainer.className = 'dropdown-menu-container';

    const ul = document.createElement('ul');
    ul.className = 'dropdown-menu';

    menuItems.forEach(itemText => {
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
    button.onclick = function() {
        if (dropdownMenuContainer.style.display === 'block') {
            dropdownMenuContainer.style.display = 'none';
            return;
        }
        // Close all other dropdowns by querying them
        document.querySelectorAll('.dropdown-menu-container').forEach(container => {
            container.style.display = 'none';
        });
        // Toggle the display of this dropdownMenuContainer
        dropdownMenuContainer.style.display = 'block';
    };

    return dropdownSelectDiv;
}
function generateHtmlForIdeasStrike() {
    const htmlString = `<div class="ideas-strike">
        <img src="https://www.icicidirect.com/Content/images/target.png" alt="target" loading="lazy" width="24" height="20">
            <span> <p>Gladiator Stocks delivered&nbsp;<strong>79% success rate</strong></p> </span>
            <img src="https://www.icicidirect.com/Content/images/target.png" alt="target" loading="lazy" width="24" height="20">

    </div>`;
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.firstElementChild;
}

function generateHtmlForCompanyCard(companies) {
    return companies.map(company => {
        return `<div class="slide slick-slide slick-current slick-active" data-slick-index="1" aria-hidden="false"  tabindex="0" role="tabpanel" id="slick-slide11" aria-describedby="slick-slide-control11">
      <div class="box box-theme">
          <div class="heading_wrap">
              <h4 title="${company.name}">
                  ${company.name}
              </h4>
              <div class="icon_wrap">
                  <a href="#" class="" tabindex="0">
                      <img src="https://www.icicidirect.com/Content/images/icon-bookmark.svg" alt="">
                  </a>
                  <a href="#" class="" tabindex="0">
                      <img src="https://www.icicidirect.com/Content/images/icon-share-2.svg" alt="">
                  </a>
              </div>
          </div>
          <div class="row">
              <div class="col-sm-6 col-6">
                  <div class="value-content">
                      <label>Reco. Price</label>
                      <h5 class="label_value">${company.recoPrice}</h5>
                  </div>
              </div>
              <div class="col-sm-6 col-6">
                  <div class="value-content">
                      <label>CMP</label>
                      <h5 class="label_value"><span class="icon-rupee"></span>${company.cmp}</h5>
                  </div>
              </div>
              <div class="col-sm-6 col-6">
                  <div class="value-content">
                      <label>Target Price</label>
                      <h5 class="label_value"><span class="icon-rupee"></span>${company.targetPrice}</h5>
                  </div>
              </div>
              <div class="col-sm-6 col-6">
                  <div class="value-content">
                      <label>Stop Loss</label>
                      <h5 class="label_value"><span class="icon-rupee"></span>${company.stopLoss}</h5>
                  </div>
              </div>
          </div>
          <div class="box-footer box-footer-theme">
              <div class="btn-wrap">
                  <a href="https://secure.icicidirect.com/trading/equity/marginsell" class="btn btn-sell " target="_blank" tabindex="0">SELL</a>
              </div>
              <div class="footer-label" style="display:none" id="showdiv">
                  <label> </label>
                  <span class="label_value"></span>
              </div>
          </div>
      </div>
  </div>`;
    })
}


function generateDiscoverMoreElement() {
    const htmlString = `<div class="mt-3 text-md-right text-center discover-more">
                            <a href="https://www.icicidirect.com/research/equity/investing-ideas" class="link-color" target="_blank">Discover More <i class="icon-up-arrow icon"></i></a>
                        </div>`;
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.firstElementChild;

}

async function fetchAndProcessCompaniesData() {
    const apiUrl = `${window.location.origin}/draft/anagarwa/tradingtips.json`;
    try {
        const response = await fetch(apiUrl);
        console.log("response" + response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Transform the API response to the desired companies array format
        const companies = data.data.map(company => ({
            name: company.CompanyName,
            recoPrice: company.RecoPrice,
            cmp: company.cmp,
            targetPrice: company.target,
            stopLoss: company.stoploss
        }));
        return companies;
    } catch (error) {
        console.error("Could not fetch companies data:", error);
    }
}