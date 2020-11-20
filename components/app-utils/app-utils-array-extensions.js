import $ from 'jquery';

export default ArrayExtensions;

function ArrayExtensions(arrayList) {
    return $.extend(this, arrayList);
}

ArrayExtensions.prototype.getIndexBy = function(functionToMatch) {
    const array = this;

    for (let i = 0; i < array.length; i++) {
        if (functionToMatch(array[i])) {
            return i;
        }
    }
    return -1;
};

ArrayExtensions.prototype.getNextIndexCircular = function(index) {
    const array = this;

    if (index < 0) {
        return -1;
    }

    return (index + 1) % array.length;
};
