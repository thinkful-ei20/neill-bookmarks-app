'use strict';
/* global bookmarkList store api $*/

$(document).ready(function () {
    bookmarkList.bindEventListeners();
    bookmarkList.render();

    api.getItems((items) => {
        console.log(items);
        items.forEach((item) => store.addItem(item));
        bookmarkList.render();

    });
});