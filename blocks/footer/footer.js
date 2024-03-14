import {
  decorateSections,  
  updateSectionsStatus
} from '../../scripts/aem.js';

function decorateFooterTop(block) {
  const footerTop = block.querySelector('.footer-top');
  const defaultWrapper = footerTop.querySelector('.default-content-wrapper'); 
  const children = [...footerTop.querySelector('.default-content-wrapper').children];
  let index = 0;
  defaultWrapper.innerHTML = '';
  const rowElement = document.createElement('div');
  defaultWrapper.appendChild(rowElement);

  const col1 = document.createElement('div');
  col1.classList.add('col-1');
  col1.appendChild(children[0]);
  const imageElement = document.createElement("img");
  const anchorDiv = children[1].childNodes[0]
  imageElement.src = anchorDiv.href;
  imageElement.alt = "ICICI Logo Footer";
  col1.appendChild(imageElement);

  const col2 = document.createElement('div');
  col2.classList.add('col-2');
  col2.appendChild(children[2]);
  children[3].childNodes[0].classList.add('tollFreeNumber');
  col2.appendChild(children[3].childNodes[0]);

  const col3 = document.createElement('div');
  col3.classList.add('col-3');
  col3.appendChild(children[4]);
  children[5].childNodes[0].classList.add('tollFreeNumber');
  col3.appendChild(children[5].childNodes[0]);

  rowElement.appendChild(col1);
  rowElement.appendChild(col2);
  rowElement.appendChild(col3);

  footerTop.classList.add('footer-top-container');
  defaultWrapper.className = '';
  defaultWrapper.classList.add('footer-top-wrapper');
  rowElement.classList.add('footer-top','row');
}

function decorateFooterLinks(block) {
  const footerTop = block.querySelector('.footer-links');
  const defaultWrapper = footerTop.querySelector('.default-content-wrapper'); 
  const children = [...footerTop.querySelector('.default-content-wrapper').children];
  let index = 0;
  defaultWrapper.innerHTML = '';
  const row = document.createElement('div');
  row.classList.add('row');
  while (index < children.length) {
    if (children[index].tagName === 'H2' && children[index+1].tagName === 'H3' && children[index+2].tagName === 'UL') {
         const columnDiv = document.createElement('div');
         columnDiv.classList.add('linksColumn');
         columnDiv.appendChild(children[index+1]).classList.add('linksTitle');
         index+=2;  
         while(index < children.length && children[index].tagName !== 'H2'){
          if(children[index].tagName !== 'H3'){
            if(children[index].tagName === 'UL'){
              const footerMenuLinks = document.createElement('div');
              let linksLenght = 0;
              const ulList = children[index];
              while(linksLenght < ulList.childElementCount){
                footerMenuLinks.appendChild( ulList.children[linksLenght].children[0]);
                linksLenght++;
              }
              columnDiv.appendChild(footerMenuLinks);
            }
          }
          else {
            columnDiv.appendChild(children[index]).classList.add('linksTitle');
          }
          index++;
         }
         row.appendChild(columnDiv);
    }
    else{
      index++;
    }
  }
  defaultWrapper.appendChild(row);
}
/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';
  // fetch footer content
  const footerPath = "/draft/ravverma/footer"
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});
  if (resp.ok) {
    const html = await resp.text();
    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;
    decorateSections(footer);
    updateSectionsStatus(footer);
    block.append(footer);
    decorateFooterTop(block);
    decorateFooterLinks(block);
  }
}