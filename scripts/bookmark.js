'use strict';
/* global  $ api store */
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
      <label>Title<input class='create-title' required type='text' placeholder='AOL'></label>
      <label>Site Address<input class='create-url' required type='url' placeholder='https://www.aol.com'></label>
      <label>Description<input class='create-description' required type='text' placeholder="You've got mail!"></label>
      <label>Rating<select name='rating' class='create-rating'>
          <option value='5'>5 stars</option>
          <option value='4'>4 stars</option>
          <option value='3'>3 stars</option>
          <option value='2'>2 stars</option>
          <option value='1'>1 star</option>
        </select></label>
      <button class='create-submit-button'>Add New Bookmark</button>
    </form>
    `;
    }

    function generateBookmarkItemsString(bookmarkList) {
        const items = bookmarkList.map((item) => generateItemElement(item));
        return items.join('');
    }

    function render() {

        let items = store.items;
        const checkingState = generateCreateBookmarkForm();

        if (store.creatingState) {
            $('.create-form').html(checkingState);
        }

        items = items.filter(element => element.rating >= store.filterLevel);

        const bookmarkListString = generateBookmarkItemsString(items);
        $('.js-bookmark-list').html(bookmarkListString);

    }


    function handleToggleCollapsed() {
        $('.js-bookmark-list').on('click', '.js-title', event => {
            const id = getItemIdFromElement(event.currentTarget);
            store.toggleState(id);
            render();
        });
    }

    function handleDelete() {
        $('.js-bookmark-list').on('click', '.js-delete-button', event => {
            if (confirm('Are you sure?') ) {
                const id = getItemIdFromElement(event.currentTarget);
                api.deleteBookmark(id, () => {
                    store.deleteBookmarkStore(id);
                    render();
            
                });
            } 
        });
    }

    function handleCreateBookmark() {
        $('.container').on('click', '.create-bookmark', event => {
            event.preventDefault();
            store.switchCreating();
            render();
        });
    }


    function handleCreateFormSubmit() {
        $('.container').on('submit', 'form', event => {
            event.preventDefault();
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


                const refresh = function () {
                    api.getItems((items) => {
                        store.items = [];
                        items.forEach((item) => store.addItem(item));
                        render();

                    });
                };

                api.createBookmark(formData, refresh);

            } else {
                store.createFormChecker = false;
                render();
            }
        });
    }


    function getItemIdFromElement(item) {
        return $(item)
            .closest('.js-item-element')
            .data('item-id');
    }

    function filterByRating() {
        $('.createNewAndFilter').on('change', '.select-rating-filter', event => {
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

    return {
        render: render,
        bindEventListeners: bindEventListeners,
    };
}());
