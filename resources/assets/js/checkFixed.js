function queryRemoveChildrenFromArray(elements, parent) {
    var array = [];
    var len = elements.length;
    for (var i = 0; i < len; i++) {
        if (!parent.contains(elements[i]) && elements[i].tagName != 'SCRIPT') {
            array.push(elements[i]);
        }
    }
    return array;
}

function checkFixedElements() {
    var len = this.partner_elements.length;
    for (var i = 0; i < len; i++) {
        if (window.getComputedStyle(this.partner_elements[i], null).getPropertyValue('position') == 'fixed') {
            var element = checkElementInView(this.partner_elements[i], 90);
            //check each element view and top of page then push into fixed partner elements
            var elementWindowPercent = (element.rect.w / window.innerWidth) * 100;
            if (element.isVisible && element.rect.top <= 150 && elementWindowPercent >= 80 && fixed_partner_elements.indexOf(i) === -1) {
                var elementId = -1;
                fixed_partner_elements.some(function (el) {
                    elementId = el.id;
                });
                if (elementId === -1) {
                    var eObj = {
                        id: i,
                        elem: this.partner_elements[i],
                        info: element
                    };
                    fixed_partner_elements.push(eObj);
                }
            }

            for (var f = 0; f < fixed_partner_elements.length; f++) {
                if (!element.isVisible && fixed_partner_elements[f].id == i) {
                    var index = f;
                    fixed_partner_elements.splice(index, 1);
                }
            }
        }
    }
    compensatePartnerFixedHeight(this.partner_elements, fixed_partner_elements);
}

function compensatePartnerFixedHeight(elementArray, partnerElements) {
    var height = 0;
    for (var a = 0; a < partnerElements.length; a++) {
        height += elementArray[a].offsetHeight;
    }
    partnerFixedHeight = height;
}
