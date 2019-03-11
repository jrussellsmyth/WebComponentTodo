import { quoteattr } from './utils.js'
export default (() => {
class TodoList extends HTMLElement {
    
    static get observedAttributes() {
        return ['placeholder', 'autofocus'];
    }
    constructor(){
        super();
    }
    
    get value() {
        return this._value || [];
    }
    set value(val) {
        this._value = Array.isArray(val)?val:[];
        this.render();
    }
    connectedCallback(){
        this.render();
    }
    render() {
        // this.innerHTML = `
        //     ${this.value.map(item=>`<todo-item ${item.completed?'completed':''} todo-id='${item.id}' value='${quoteattr(item.text)}'></todo-item>`).join('')}
        // `
        this.innerHTML = `
            ${this.value.map(item=>`<todo-item ${item.completed?'completed="completed"':''} todo-id='${item.id}' value='${quoteattr(item.text)}'></todo-item>`).join('')}
        `
    }
    attributeChangedCallback(name, oldValue, newValue){
    }
    disconnectedCallback() {
    }
}
    customElements.define('todo-list', TodoList);
    return TodoList;
})()