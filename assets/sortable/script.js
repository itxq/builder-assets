/* 拖拽排序 */
$(document).ready(function () {
    let builderSortableItems = document.getElementsByClassName('form-json-group-core');
    let builderSortableItemsLength = builderSortableItems.length;
    for (let i = 0; i < builderSortableItemsLength; i++) {
        Sortable.create(builderSortableItems[i], {animation: 250});
    }
});