# _Web Component_ Application demonstration following the TodoMVC Template


![](https://github.com/tastejs/todomvc-app-css/raw/master/screenshot.png)

## What Is It

This is a complete application as demonstrated by the TodoMVC  project, reimplemented using Web Components as the primary develoment framework.

As Web Components does not provide for application state or routing, a small application is written using [Redux](https://redux.js.org/) for state and [Navigo](https://github.com/krasimir/navigo) for routing.

## Getting started

```bash
  npm install && npm start
  browse to https://localhost:8080/src/index.html
```

**Note**: this demonstration requires support for import maps, which at this time includes Chrome and Edge with ``Experimental Web Platform features`` flag enabled

# The Elements

The application is defined as a set of elements with attributes and properties for input, and firing custom events for output.
All events are expected to bubble, to allow capturing at any outer container, and not requiring immediate knowledge of the elements existence.

The Redux application can respond to these events, as well as update the attributes and properties of the elements. Each element is described as a component specification to allow freedom in implementation details.

## toggle-all

__Attributes__
- checked - set when toggle to "all selected"

__Properties__
- checked - true/false

__Events__
- change - fired any time the checked state is toggled.

## new-todo  (could be more generic - new-text-item)
A text-input element that will fire a "new item" event with the text entered and clear its content if the enter key is pressed.

__Attributes__
- placeholder: placeholder text for the new-todo text entry box
- autofocus: if attribute is set text entry box is set to autofocus

__Events__
- newitem: fired any time a new item is requested
  - value: text of a new item to be created

## todo-list - visual list of todos. will render <todo-item> elements for each todo
Renders a sequence of <todo-item> elements with the content of its "value" property. Should properly dynamically update
if the property is updated.

__Properties__
- value: the todo list as a js array

## todo-item - displays and edits a single todo
Displays a single todo item with a checkbox for completed, and a "X" button to delete.
Double click allows editing value
When editing, on blur or enter key, emits a "change" event
On toggle completed will toggle the "complete" attribute and will fire a change event

__Attributes__
- todo-id:  id for the displayed todo
- complete: boolean that is triggered when the todo item is complete
- editing:  boolean that is triggered when the todo is being edited
- value:    the todo text

__Properties__
- value - the current todo text

__Events__
- change - when todo value has been changed
- delete - when user requests deletion of the todo

## todo-count - displays the count of todos, with appropriate text item/items with proper english use
__Attributes__
- value - count of todos

__Properties__
- value - number, count of todos

# The Routes
|Display|Route|
|:--|:--|
|All|        "#/"|
|Active   |   "#/active"|
|Completed  | "#/completed"|

# Application Behaviour
- when all tasks are marked completed, set task toggle to checked

# Design and Implementation Details
Elements should follow best practices documented
[HERE](https://developers.google.com/web/fundamentals/web-components/best-practices)


## License

Based on code licensed:
<br />
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/80x15.png" /></a><br /> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://sindresorhus.com" property="cc:attributionName" rel="cc:attributionURL">TasteJS</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US">Creative Commons Attribution 4.0 International License</a>.
