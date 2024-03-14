// eslint-disable-next-line no-unused-vars
function onClick() {
  const disclaimerDiv = document.querySelector('.panel-body');
  const iconDiv = document.querySelector('.toggle-icon');
  if (disclaimerDiv.classList.contains('slide-up')) {
    // If the content is currently hidden, slide it down
    disclaimerDiv.classList.remove('slide-up');
    iconDiv.textContent = '-';
  } else {
    // If the content is currently visible, slide it up
    disclaimerDiv.classList.add('slide-up');
    iconDiv.textContent = '+';
  }
}
