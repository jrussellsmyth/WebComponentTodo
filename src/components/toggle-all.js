import { addDestroyableEventListener } from './utils.js'
export default (() => {
    class ToggleAll extends HTMLElement {
        
        static get observedAttributes() {
            return ['checked'];
        }
        constructor(){
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `
            <style>
            :host  {
                padding: 12px 16px;
                display:block;
                font-size: 0;
            }
            
            :host::before {
                display:block;
                line-height: 1;
                content: '❯';
                font-size: 22px;
                color: #e6e6e6;
                -webkit-transform: rotate(90deg);
                    transform: rotate(90deg);
                    margin: 50% 45% 50% 50%;
            
            }
            
            :host([checked])::before {
                color: #737373;
            }
            </style>            
            `;
        }
        
        get checked() {
            return this.hasAttribute('checked');
        }
        set checked(val) {
            val?this.setAttribute('checked',''):this.removeAttribute('checked');
        }
        
        connectedCallback(){
            this.clickHandler = addDestroyableEventListener(this, 'click', e=>{
                this.checked = !this.checked;
                e.preventDefault();
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent('change',{bubbles:true}));
            });
        }
        
        attributeChangedCallback(name, oldValue, newValue){
        }
        disconnectedCallback() {
            this.clickHandler && this.clickHandler.destroy() && delete this.clickHandler;
        }
    }
        customElements.define('toggle-all', ToggleAll);
        return ToggleAll;
    })()