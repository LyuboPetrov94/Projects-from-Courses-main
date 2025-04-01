import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupBtn('next', currPage, currPage + 1);
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupBtn('prev', currPage, currPage - 1);
    }

    // Other page
    if (currPage < numPages) {
      return `${this._generateMarkupBtn('prev', currPage, currPage - 1)},
                ${this._generateMarkupBtn('next', currPage, currPage + 1)}`;
    }

    // Page 1, and there are NO pages - render nothing
    return '';
  }

  _generateMarkupBtn(btn, currentPage, goTo) {
    return `
        <button data-goto="${goTo}" class="btn--inline pagination__btn--${btn}">
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-${
      btn === 'next' ? 'right' : 'left'
    }"></use>
                </svg>
                <span>Page ${
                  btn === 'next' ? currentPage + 1 : currentPage - 1
                }</span>
          </button>  
    `;
  }
}

export default new PaginationView();
