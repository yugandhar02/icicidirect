export default async function decorate(block) {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row border-wrapper';
  const titleDiv = document.createElement('div');
  titleDiv.className = 'title text-center';

  const titleText = document.createElement('h2');
  titleText.textContent = 'BLOGS';
  titleDiv.appendChild(titleText);
  rowDiv.appendChild(titleDiv);
  block.appendChild(rowDiv);
}
