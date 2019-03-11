import { addDestroyableEventListener } from './utils.js'

export default (() => {
let template = `
<style>
:host{
    display:block;
    width:100%;
}
input
{
	position: relative;
	margin: 0;
	width: 100%;
	font-size: 24px;
	font-family: inherit;
	font-weight: inherit;
	line-height: 1.4em;
	border: 0;
	color: inherit;
	padding: 6px;
	border: 1px solid #999;
	box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
	box-sizing: border-box;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

input{
	padding: 16px 16px 16px 60px;
	border: none;
	background: rgba(0, 0, 0, 0.003);
	box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
}
</style>
<input>
`
// polyfill custom event


class NewTodo extends HTMLElement {
    
    static get observedAttributes() {
        return ['placeholder', 'autofocus'];
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = template;
    }
    
    get placeholder() {
        return this.getAttribute('placeholder') || ''
    }
    get autofocus() {
        return this.hasAttribute('autofocus') || ''
    }
    set placeholder(val) {
        this.setAttribute('placeholder', val);
    }
    get input() {
        return this.shadowRoot.querySelector('input');
    }
    get value() {
        return this.input.value;
    }
    set value(val) {
        this.input.value = val;
    }
    connectedCallback(){
        this._updateChildAttributes();
        this.keypressListener = addDestroyableEventListener(this.input, 'keydown', (e)=>{
            if(e.code === "Enter"){
                e.target.value && 
                e.target.value.trim().length>0 && 
                this.dispatchEvent(new CustomEvent('newitem',{bubbles:true,detail:{value:e.target.value}}));
                e.preventDefault();
                e.stopPropagation();
                e.target.value='';
            }
        });
    }
    attributeChangedCallback(name, oldValue, newValue){
        this._updateChildAttributes();
    }
    _updateChildAttributes(){
       this.input && (this.input.placeholder = this.placeholder);
       this.input && this.autofocus? this.input.setAttribute('autofocus',''):this.input.removeAttribute('autofocus');
    }
    disconnectedCallback() {
        this.input.removeEventListener(this.handler);
        delete this.handler;
    }
}
    customElements.define('new-todo', NewTodo);
    return NewTodo;
})()