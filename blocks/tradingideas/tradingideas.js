import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    /* change to ul, li */
//    block.content=' i am gere';
    block.textContent = '';
    const explorerContainer = document.createElement('div');
    explorerContainer.className = 'explore-container';
    block.appendChild(explorerContainer);

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
    explorerBody.appendChild(researchSlider);
    const slickList     = document.createElement('div');
    slickList.classList.add('slick-list');
    slickList.classList.add('draggable');
    researchSlider.appendChild(slickList);

    const slickTrack     = document.createElement('div');
    slickTrack.classList.add('slick-track');
    slickList.appendChild(slickTrack);






    const htmlElementsArray = generateHtmlFromArray(companies);
    htmlElementsArray.forEach(htmlString => {
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        const element = div.firstElementChild;
        slickTrack.appendChild(element);

    });
}


function generateHtmlFromArray(companies) {
    return companies.map(company => {
        return `<div class="slide slick-slide slick-current slick-active" data-slick-index="1" aria-hidden="false" style="width: 302px; height: 279px;" tabindex="0" role="tabpanel" id="slick-slide11" aria-describedby="slick-slide-control11">
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

// Example usage:
const companies = [
    {
        name: "STEEL AUTHORITY OF INDIA LTD",
        recoPrice: "128",
        cmp: "130",
        targetPrice: "127",
        stopLoss: "129"
    },
    {
        name: "L N T",
        recoPrice: "188",
        cmp: "190",
        targetPrice: "127",
        stopLoss: "129"
    },
    {
        name: "STEEL AUTHORITY OF INDIA LTD",
        recoPrice: "128",
        cmp: "130",
        targetPrice: "127",
        stopLoss: "129"
    },

    // Add more objects for each company as needed
];