'use strict';
// eslint-disable-next-line no-unused-vars
const store = (function () {


    const addItem = function (item) {
        item.collapsed = true;
        this.items.push(item);
    };

    const toggleState = function (id) {
        let currentItem = this.items.find(bookmark => bookmark.id === id);
        currentItem.collapsed = !currentItem.collapsed;
    };

    const deleteBookmarkStore = function (id) {
        let currentItem = this.items.find(bookmark => bookmark.id === id);
        let currentIndex = this.items.indexOf(currentItem);
        this.items.splice(currentIndex, 1);
    };

    const switchCreating = function () {
        console.log(this.creatingState);
        this.creatingState = !this.creatingState;
        console.log(this.creatingState);
    };


    return {
        items: [],
        creatingState: false,
        filterLevel: null,
        createFormChecker: true,

        addItem,
        toggleState,
        deleteBookmarkStore,
        switchCreating,

    };
}());