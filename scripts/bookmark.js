'use strict';
// eslint-disable no-unused-vars

$(function () {
    render();
    addNew();
});

const render = function () {
    $('#renderTarget').html('');
    STORE.bookmarks.forEach(bookmark => {
        const htmlRender = `
      <li>
        <article>
          <h2>${bookmark.title}</h2>
          <span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span>
          <p>${bookmark.description}</p>
          <button>
           ${bookmark.url}
          </button>
        </article>
      </li>`;

        $('#renderTarget').append(htmlRender);

    });

};

const addNew = function () {
    $('#addNewButton').click(function () {
        STORE.bookmarks.push({
            title: 'New item',
            description: 'new long desc',
            url: 'www.example.com',
            rating: 3,
        });
        render();
    });
};