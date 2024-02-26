import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'header';
    headerDiv.innerHTML = `
    <h1>Trading Ideas</h1>
    <div class="controls">
      <button class="control-btn active">Buy</button>
      <button class="control-btn">All</button>
    </div>
  `;

    // Create the investing ideas div
    const investingIdeasDiv = document.createElement('div');
    investingIdeasDiv.className = 'investing-ideas';

    // Example of an idea, you can create more in a similar fashion
    const ideaDiv = document.createElement('div');
    ideaDiv.className = 'idea';
    ideaDiv.innerHTML = `
    <h3>Star Cement</h3>
    <div class="profit">23.08% Profit Potential</div>
    <div class="cmp">CMP ₹205.85</div>
    <div class="target">Target Price ₹240.00</div>
    <div class="stop-loss">Stop Loss NA</div>
    <button class="btn-buy">Buy</button>
    <a href="#" class="view-report">View Report</a>
  `;

    // Append the idea div to the investingIdeasDiv
    investingIdeasDiv.appendChild(ideaDiv);

    // Finally, append the header and the investing ideas div to the block div
    blockDiv.appendChild(headerDiv);
    blockDiv.appendChild(investingIdeasDiv);
}