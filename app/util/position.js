"use strict";
var Position = (function () {
    function Position() {
    }
    Position.prototype.getClosestNotStaticParent = function (hostEl) {
        var parentEl = hostEl.parentElement;
        while (parentEl && parentEl !== document.documentElement && this.isStaticPositioned(parentEl)) {
            parentEl = parentEl.parentElement;
        }
        return parentEl;
    };
    Position.prototype.getStyle = function (el, prop) {
        return window.getComputedStyle(el)[prop];
    };
    Position.prototype.isStaticPositioned = function (el) {
        return (this.getStyle(el, 'position') || 'static') === 'static';
    };
    Position.prototype.layout = function (targetEl) {
        var parentEl = this.getClosestNotStaticParent(targetEl);
        var parentOffset = parentEl.getBoundingClientRect(), targetOffset = targetEl.getBoundingClientRect();
        return {
            left: Math.round(targetOffset.left - parentOffset.left) + 'px',
            top: Math.round(targetOffset.bottom - parentOffset.top) + 'px',
            width: Math.round(targetOffset.width) + 'px'
        };
    };
    return Position;
}());
exports.Position = Position;
var position = new Position();
function layout(targetEl) {
    return position.layout(targetEl);
}
exports.layout = layout;
//# sourceMappingURL=position.js.map