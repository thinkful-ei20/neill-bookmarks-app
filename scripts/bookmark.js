'use strict';
/* global  $ api api store */
// eslint-disable-next-line no-unused-vars
const bookmarkList = (function () {

    function generateItemElement(item) {
        return `
      <li class='js-item-element' data-item-id='${item.id}'>         
        <h2 class='js-title'>${item.title} </h2>      
        <div class='rating'>Rating: ${item.rating} stars</div> 
        <div class='${item.collapsed ? 'hidden' : ''}'>               
          <p>${item.desc}</p>
          <a href='${item.url}' target='_blank'><button>Go to site</button></a>
          <button class='js-delete-button'>Delete</button>
        </div>
      </li>
    `;
    }

    function generateCreateBookmarkForm() {
        return `
    <form class='js-create-form'>
      <input class='create-title' type='text' placeholder='Bookmark Title'>
      <input class='create-url' type='text' placeholder='http://'>
      <input class='create-description' type='text' placeholder='Detailed Description'>
      <select name='rating' class='create-rating'>
          <option value='1'>1 star</option><option value='2'>2 stars</option><option value='3'>3 stars</option><option value='4'>4 stars</option><option value='5'>5 stars</option>
        </select>
      <button class='create-submit-button'>Add New Bookmark</button>
    </form>
    `;
    }

    // error checking on submit

    function generateBookmarkItemsString(bookmarkList) {
        const items = bookmarkList.map((item) => generateItemElement(item));
        return items.join('');
    }

    function render() {
        let items = store.items;
        const checkCreatState = generateCreateBookmarkForm();

        if (store.creatingState) {
            $('.create-form').html(checkCreatState);
        }

        console.log('render ran');
        const bookmarkListString = generateBookmarkItemsString(items);
        $('.js-bookmark-list').html(bookmarkListString);

        // reassign items 42-50 new smaller (filtered array) is what gets filtered -> rendered


    }


    function handleToggleCollapsed() {
        $('.js-bookmark-list').on('click', '.js-title', event => {
            const id = getItemIdFromElement(event.currentTarget);
            store.toggleState(id);
            console.log(`${id} clicked`);
            render();
        });
    }

    function handleDelete() {
        $('.js-bookmark-list').on('click', '.js-delete-button', event => {
            const id = getItemIdFromElement(event.currentTarget);
            console.log('Delete button clicked');
            api.deleteBookmark(id, () => {
                store.deleteBookmarkStore(id);
                render();
            });
        });
    }

    function handleCreateBookmark() {
        $('.container').on('click', '.create-bookmark', event => {
            event.preventDefault();
            console.log('handleCreateBookmark ran');
            store.switchCreating();
            render();
        });
    }

    // verifyFormSubmit

    function handleCreateFormSubmit() {
        $('.container').on('click', '.create-submit-button', event => {
            event.preventDefault();
            console.log('handleCreateFormSubmit ran');
            const title = $('.create-title').val();
            const url = $('.create-url').val();
            const description = $('.create-description').val();
            const rating = $('.create-rating').val();

            if (store.items) {
                const formData = {
                    'title': title,
                    'url': url,
                    'desc': description,
                    'rating': rating
                };

                console.log(formData);

                const refresh = function () {
                    api.getItems(store.switchCreating());
                };
                render();
                api.createBookmark(formData, refresh);

            } else {
                store.createFormChecker = false;
                render();
            }
            // need to have render run after button submit
        });
    }

    function getItemIdFromElement(item) {
        return $(item)
            .closest('.js-item-element')
            .data('item-id');
    }

    function filterByRating() {
        $('.container').on('click', '.select-rating-filter', event => {
            const filterValue = +$('.select-rating-filter option:selected').val();
            store.filterLevel = filterValue;
            render();

        });
    }


    function bindEventListeners() {
        handleToggleCollapsed();
        getItemIdFromElement();
        handleDelete();
        handleCreateBookmark();
        generateCreateBookmarkForm();
        handleCreateFormSubmit();
        filterByRating();


    }

    // This object contains the only exposed methods from this module:
    return {
        render: render,
        bindEventListeners: bindEventListeners,
    };
}());
