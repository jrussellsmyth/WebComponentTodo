import { addDestroyableEventListener } from './utils.js'
export default (() => {
let template = `
   <style>
        :host {
            display:block;
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
        
:host {
	position: relative;
	font-size: 24px;
	border-bottom: 1px solid #ededed;
}

:host:last-child {
	border-bottom: none;
}

:host([editing]) {
	border-bottom: none;
	padding: 0;
}

:host([editing]) .edit {
	display: block;
	width: 506px;
	padding: 12px 16px;
	margin: 0 0 0 43px;
}

:host([editing])  .view {
	display: none;
}

.toggle {
	text-align: center;
	width: 40px;
	/* auto, since non-WebKit browsers doesn't support input styling */
	height: auto;
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto 0;
	border: none; /* Mobile Safari */
	-webkit-appearance: none;
	appearance: none;
}

.toggle {
	opacity: 0;
}

.toggle + label {

	background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
	background-repeat: no-repeat;
	background-position: center left;
}

.toggle:checked + label {
	background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
}

label {
	word-break: break-all;
	padding: 15px 15px 15px 60px;
	display: block;
	line-height: 1.2;
	transition: color 0.4s;
}

:host([completed]) label {
	color: #d9d9d9;
	text-decoration: line-through;
}        
        
        
        button {
            margin: 0;
	        padding: 0;
        	border: 0;
        	background: none;
        	font-size: 100%;
        	vertical-align: baseline;
        	font-family: inherit;
        	font-weight: inherit;
        	color: inherit;
        	-webkit-appearance: none;
        	appearance: none;
        	-webkit-font-smoothing: antialiased;
        	-moz-osx-font-smoothing: grayscale;
        	display: none;
        	position: absolute;
        	top: 0;
        	right: 10px;
        	bottom: 0;
        	width: 40px;
        	height: 40px;
        	margin: auto 0;
        	font-size: 30px;
        	color: #cc9a9a;
        	margin-bottom: 11px;
        	transition: color 0.2s ease-out;
        }
        
        button:hover {
        	color: #af5b5e;
        }
        
        button:after {
        	content: '×';
        }
        
        :host(:hover) button {
        	display: block;
        }
        
         .edit {
        	display: none;
        }
        
        :host([editing]):last-child {
        	margin-bottom: -1px;
        }        
   </style>
   <div class="view">
       <input class="toggle" type="checkbox">
		   <label></label>
	       <button></button>
   </div>
   <input class="edit" value="Rule the web">    
`;


class TodoItem extends HTMLElement {
    static get observedAttributes() {
        return ['placeholder', 'autofocus'];
    }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = template;
    }
    get label() {
        return this.shadowRoot.querySelector('label');
    }
    get editField() {
        return this.shadowRoot.querySelector('.edit');
    }
    get checkbox() {
        return this.shadowRoot.querySelector('[type="checkbox"]');
    }
    get deleteButton() {
        return this.shadowRoot.querySelector('button');
    }
    get value() {
        return this.getAttribute('value') || '';
    }
    set value(val) {
        this.setAttribute('value', val);
        this.label.textContent = val;
    }
    get todoId() {
        return this.getAttribute('todo-id') || '';
    }
    set todoId(val) {
        this.setAttribute('todoId', val);
    }
    get completed() {
        return this.hasAttribute('completed');
    }
    set completed(val) {
        val?this.setAttribute('completed','')&&(this.checkbox.checked=true):this.removeAttribute('completed')&&(this.checkbox.checked=false);
    }
    get view() {
        return this.shadowRoot.querySelector('.view');
    }
    set editing(val){
       val? this.setAttribute('editing',''):this.removeAttribute('editing');
    }
    connectedCallback(){
        this._syncAttributes();
        this.checkboxListener = addDestroyableEventListener(this.checkbox, 'change', (e)=>{
            this.completed = e.target.checked;
            e.preventDefault();
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('change',{bubbles:true}));
        })
        this.deleteListener = addDestroyableEventListener(this.deleteButton, 'click', (e)=>{
            e.preventDefault();
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('delete',{bubbles:true}));
        })
        this.doubleClickListener = addDestroyableEventListener(this.view, 'dblclick', (e)=>{
            e.preventDefault();
            e.stopPropagation();
            this.editing=true;
            this.editField.focus();
        })
        this.blurListener = addDestroyableEventListener(this.editField, 'blur', (e)=>{
            e.preventDefault();
            e.stopPropagation();
            this.editing=false;
        })
        this.changeListener = addDestroyableEventListener(this.editField, 'change', (e)=>{
            this.value = e.target.value;
            e.preventDefault();
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('change',{bubbles:true}));

        })
        this.keypressListener = addDestroyableEventListener(this.editField, 'keydown', (e)=>{
            e.code === "Enter" && e.target.blur();
        })
        
    }
    attributeChangedCallback(name, oldValue, newValue){
        this._syncAttributes();
    }
    disconnectedCallback() {
        this.checkboxListener && this.checkboxListener.destroy() && delete this.checkboxListener;
        this.deleteListener && this.deleteListener.destroy() && delete this.deleteListener;
    }
    _syncAttributes() {
        this.label.textContent = this.value;
        this.checkbox.checked=this.completed;
        this.editField.value= this.value;
    }
}
    customElements.define('todo-item', TodoItem);
    return TodoItem;
})()