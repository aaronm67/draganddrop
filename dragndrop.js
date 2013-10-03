(function(window) {
    'use strict';
    var Draggable = { };
    var Droppable = { };

    Draggable.defaults = {
        /**
         * Fires when drag starts
         *
         * https://developer.mozilla.org/en-US/docs/Web/Reference/Events/dragstart
         *
         * @type {Function(DragEvent)}
         */
        start: noop,

        /**
         * Fires when drag ends
         *
         * https://developer.mozilla.org/en-US/docs/Web/Reference/Events/dragend
         * 
         * @type {Function(DragEvent)}
         */
        stop: noop,

        /**
         * Fires on mousemove while dragging this element.
         *
         * https://developer.mozilla.org/en-US/docs/Web/Reference/Events/drag
         * 
         * @type {Function(DragEvent)}
         */
        drag: noop,


        /**
         * The kinds of operations that are to be allowed
         *
         * The possible values are "none", "copy", "copyLink", "copyMove", "link", "linkMove", "move", "all", and "uninitialized",
         *
         * Currently not supported by the public API
         */
        dropEffect: 'all',

        /**
         * Specifies a custom drag feedback image
         * 
         * @type {HTMLImageElement or Function returning one}
         */
        dragImage: noop,

        /**
         * One of:
         * [ 'none', 'copy', 'copyLink', 'copyMove',  'link', 'linkMove', 'move', 'all' ]
         * Defines the type of "drag" that is allowed on this element.
         * 
         * @type {String}
         */
        effectAllowed: 'all',

        /**
         * Class to add when element is being dragged
         * 
         * @type {String}
         */
        dragClass: '',

        /**
         * Content transferred with the draggable
         *
         * May be:
         * A string (content type will be assumed as text/plain)
         *
         * An object in the format: {
         *     dataType: {String}
         *     content: {Object}
         * } 
         */
        dragData: noop
    };

    var initializeDraggable = function(element, opts) {
        // if we pass in a collection, initialize draggable on the entire collection
        if (element.length) {
            each(element, function(el) {
                initializeDraggable(el, opts);
            });

            return element;
        }

        opts = merge(Draggable.defaults, opts || {});

        addListener(element, 'dragstart', onDragStart);
        addListener(element, 'dragend', onDragEnd);
        addListener(element, 'drag', onDrag);
        element.draggable = true;

        function getDragClass() {
            if (isFunction(opts.dragClass)) {
                return opts.dragClass(element) || '';
            }

            return opts.dragClass || '';
        }

        function getDragData() {
            if (isFunction(opts.dragData)) {
                return opts.dragData(element);
            }

            return opts.dragData;
        }

        function onDrag(e) {
            return opts.drag.call(element, e);
        }

        function onDragStart(e) {
            addClass(element, getDragClass());

            e.dataTransfer.effectAllowed = opts.dropEffect;

            var dragData = getDragData();
            var contentType = 'text/plain';
            if (typeof(dragData) !== 'string') {
                dragData = dragData.content;
                contentType = dragData.contentType;
            }

            if (dragData) {
                e.dataTransfer.setData(contentType, dragData);
            }

            return opts.start.call(element, e);
        }

        function onDragEnd(e) {
            removeClass(element, getDragClass());
            return opts.stop.call(element, e);
        }
    };

    Droppable.defaults = {
        /**
         * 
         * Fired when a draggable element is dragged into this element
         * 
         * https://developer.mozilla.org/en-US/docs/Web/Reference/Events/dragenter
         * 
         * @type {Function(DragEvent)}
         */
        enter: noop,

        /**
         * Fires when a draggable leaves
         *
         * https://developer.mozilla.org/en-US/docs/Web/Reference/Events/dragleave
         * 
         * @type {Function(DragEvent)}
        */
        leave: noop,

        /**
         * Fires when a dragged element is dropped on this
         * Callback accepts two parameters - an "Event" and the "DataTransfer" object
         * 
         * @type {Function(DragEvent, Object)}
         */
        drop: noop,

        /**
         * Fires when a dragged element is mousemoved over this.
         * @type {Function(DragEvent)}
         */
        over: noop,

        /**
         * Class that is toggled when an element is over
         * 
         * @type {String}
         */
        hoverClass: ''
    };

    var initializeDroppable = function(element, opts) {
        opts = merge(Droppable.defaults, opts);

        if (element.length) {
            // if we pass in a collection, initialize drop on the entire collection
            return each(element, function(el) {
                initializeDroppable(el, opts);
            });
        }

        addListener(element, 'drop', onDrop);
        addListener(element, 'dragenter', onDragEnter);
        addListener(element, 'dragleave', onDragLeave);
        addListener(element, 'dragover', onDragOver);

        function onDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            removeClass(element, opts.hoverClass);
            return opts.drop.call(element, e);
        }

        function onDragEnter(e) {
            e.preventDefault();
            addClass(element, opts.hoverClass);
            return opts.enter.call(element);
        }

        function onDragOver(e) {
            e.preventDefault();
            return opts.over.call(element, e);
        }

        function onDragLeave(e) {
            removeClass(element, opts.hoverClass);
            return opts.leave.call(element, e);
        }
    };


    // export a DragAndDrop object
    window.DragAndDrop = {
        initDrag: initializeDraggable,
        initDrop: initializeDroppable
    };

    /*** Utility functions */

    /**
     * Empty function, default value for handlers
     */
    function noop() { }

    /**
     * Returns whether the 'obj' is a function
     * 
     * @param  {Object}
     * @return {Boolean}
     */
    function isFunction(obj) {
        return typeof(obj) === 'function';
    }

    /**
     * Merge obj1 into obj2, modifying obj1
     *
     * @param  {Object} obj1
     * @param  {Object} obj2
     * @return {Object}
     */
    function merge(obj1, obj2) {
        for (var name in obj2) {
            obj1[name] = obj2[name];
        }

        return obj1;
    }

    /**
     * Loop over an array
     * 
     * @param  {Array} obj  Object with a 'length'
     * @param  {Function} func callback
     */
    function each(obj, func) {
        if (Array.prototype.forEach) {
            return Array.prototype.forEach.call(obj, func);
        }

        for (var i = 0; i < obj.length; i++) {
            func(obj[i]);
        }
    }

    /**
     * Gets index of 'obj' in array. Returns -1 if not found
     * 
     * @param  {Array} array
     * @param  {Object} obj object to find in array
     * @return {Number} 0 based index of obj
     */
    function indexOf(array, obj) {
        if (Array.prototype.indexOf) {
            return Array.prototype.indexOf.call(array, obj);
        }

        var ret = -1;
        each(array, function(i) {
            ret++;
            if (i === obj) {
                return ret;
            }
        });

        return -1;
    }

    /**
     * Add class to element
     *
     * @param {Element} element
     * @param {String} class
     */
    function addClass(element, className) {
        if (className) {
            if (element.classList) {
                return element.classList.add(className);
            }

            var classes = element.className.split(' ');
            if (indexOf(classes, className) !== -1) {
                classes.push(className);
            }

            element.className = classes.join(' ');
        }
    }

    /**
     * Remove class from element
     * 
     * @param  {Element} element
     * @param  {String} className
     */
    function removeClass(element, className) {
        if (className) {
            if (element.classList) {
                return element.classList.remove(className);
            }

            var classes = element.className.split(' ');
            var idx = indexOf(classes, className);
            element.className = classes.splice(idx, 1).join(' ');
        }
    }

    /**
     * Add an event listener to element
     * 
     * @param {DOMElement} element
     * @param {String} eventName
     * @param {Function} handler
     */
    function addListener(element, eventName, handler) {
        if (element.addEventListener) {
            return element.addEventListener(eventName, handler, false);
        }

        element.attachEvent('on' + eventName, handler);
    }

    /**
     * Remove event listener from element
     * @param  {DOMElement} element
     * @param  {String} eventName
     * @param  {Function} handler
     */
    function removeListener(element, eventName, handler) {
        if (element.removeEventListener) {
            return element.removeEventListener(eventName, handler, false);
        }

        element.detachEvent('on' + eventName, handler);
    }

    /**
     * Deep Clone an object
     * @param  {Object}
     * @return {Object}
     */
    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // create a jquery plugin
    if (window.jQuery) {
        window.jQuery.fn.draggable = function(opts) {
            return this.each(function() {
                initializeDraggable(this, opts);
            });
        };

        window.jQuery.fn.droppable = function(opts) {
            return this.each(function() {
                initializeDroppable(this, opts);
            });
        };
    }

})(window);