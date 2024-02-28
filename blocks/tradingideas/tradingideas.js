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
    explorerHeader.innerHTML = `<div class="row align-items-center">
                                    <div class="col-md-6 col-4">
                                    <h3 class="">TRADING IDEAS</h3>
                                    </div>
                                    <div class="dropdown">
                                    </div>
                                </div>`;
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
                element.style.display = 'none'; // Default all to 'none' initially
                slickTrack.appendChild(element);
            });

            // Initialize the carousel view with the first 3 cards
            const cards = Array.from(slickTrack.children);
            for (let i = 0; i < 4 && i < cards.length; i++) {
                cards[i].style.display = 'block';
            }

            // Dot Navigation
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'dots-container';
            researchSlider.appendChild(dotsContainer);

            // Assuming you have 8 cards and can show 3 at a time, calculate the number of dots needed
            const numberOfDots = Math.ceil((cards.length - 3)); // For 8 cards, this results in 6 dots
            const dots = []; // To keep track of all dot elements

            for (let i = 0; i < numberOfDots; i++) {
                const dot = document.createElement('button');
                dot.className = 'dot';
                dot.dataset.index = i;
                dotsContainer.appendChild(dot);
                dots.push(dot);

                dot.addEventListener('click', function() {
                    updateCarouselView(parseInt(this.dataset.index));
                    updateActiveDot(parseInt(this.dataset.index));
                });
            }

            const updateCarouselView = (dotIndex) => {
                // Hide all cards
                cards.forEach(card => card.style.display = 'none');

                // Calculate the range of cards to show based on dot clicked
                const startIndex = dotIndex;
                const endIndex = startIndex + 4 ;

                // Show the cards in the range
                for (let i = startIndex; i < endIndex && i < cards.length; i++) {
                    cards[i].style.display = 'block';
                }
            };

            const updateActiveDot = (activeIndex) => {
                // Remove active class from all dots
                dots.forEach(dot => dot.classList.remove('active'));
                // Add active class to the currently active dot
                dots[activeIndex].classList.add('active');
            };

            // Initialize the first dot as active
            updateActiveDot(0);
        }
    });

    explorerBody.appendChild(generateDiscoverMoreElement());
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
        return `<div class="slide slick-slide slick-current slick-active" data-slick-index="1" aria-hidden="false" style="width: 280px; height: 279px;" tabindex="0" role="tabpanel" id="slick-slide11" aria-describedby="slick-slide-control11">
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