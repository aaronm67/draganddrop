## Drag and Drop ##

### About ###

This is a thin wrapper around the HTML5 Drag and Drop Api. It doesn't rely on any plugins.

I created this because the popular drag and drop plugins are all very heavy, and tend to handle the animations and events separately from
the native API.

### Options ###

All parameters are optional. All functions are called with context of the initialized elementz

##### Draggable #####
```javascript
{
     // Fires when drag starts
    start: Function(DragEvent)

    //Fires when drag ends
    stop: Function(DragEvent)

    // Specifies a custom drag feedback image
    dragImage: HTMLImageElement or Function returning one,

    // Class to add when element is being dragged
    dragClass: String or Function returning one,

    // Drag Data
    dragData: noop
};
```

##### Droppable #####
```javascript
{
    // Fired when a draggable element is dragged into this element
    enter: Function(DragEvent),

    // Fires when a draggable leaves this element
    leave: Function(DragEvent),

    // Fires when a dragged element is dropped on this
    // Callback accepts two parameters - an "Event" and the "DataTransfer" object
    drop: Function(DragEvent, Object),

    // Class that is toggled while an element is being dragged here
    hoverClass: String
}
```

### Usage ###

This plugin will expose a DragAndDrop object.

If you don't have jQuery:

```javascript
DragAndDrop.initDrag(elements, options);
DragAndDrop.initDrop(elements, options);
```

With jQuery:

```javascript
$('element').draggable(options);
$('element').droppable(options);
```

### Browser Support ###

IE 8+

Chrome (all versions)

Firefox 3.5+

### License ###

Copyright Aaron Marasco 2013, MIT License