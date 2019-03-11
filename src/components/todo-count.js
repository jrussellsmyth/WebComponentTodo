export default (() => {
    class TodoCount extends HTMLElement {
        
        static get observedAttributes() {
            return ['value'];
        }
        constructor(){
            super();
            this.attachShadow({mode: 'open'});
        }
        
        get value() {
            let val = parseInt(this.getAttribute('value'));
            return isNaN(val)?"0":val;
        }
        set value(val) {
            this.setAttribute('value', val)
        }
        
        connectedCallback(){
            this.render();
        }
        render() {
            this.shadowRoot.innerHTML = `
            <strong>${this.value}</strong> item${this.value===1?'':'s'} left
            `
        }
        attributeChangedCallback(name, oldValue, newValue){
            this.render();
        }
        disconnectedCallback() {
        }
    }
        customElements.define('todo-count', TodoCount);
        return TodoCount;
    })()