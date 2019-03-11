import { createStore, combineReducers } from 'redux';
import Navigo from 'navigo';

export default (() => {

    function todos(todos = [], action) {
        switch (action.type) {
            case 'DELETE_TODO':
                return todos.filter(t => t.id != action.id);
            case 'CLEAR_COMPLETED_TODOS':
                return todos.filter(t => !t.completed);
            case 'UPDATE_TODO':
                return todos.map((todo) => {
                    if (todo.id == action.id) {
                        return {
                            id: action.id,
                            text: action.text,
                            completed: action.completed?true:false
                        }
                    }
                    else {
                        return todo;
                    }
                })
            case 'ADD_TODO':
                return [
                    ...todos,
                    {
                        id: action.id,
                        text: action.text,
                        completed: false
                    }
                ]
            case 'TOGGLE_TODO':
                return todos.map((todo, index) => {
                    if (index === action.index) {
                        return Object.assign({}, todo, {
                            completed: !todo.completed
                        })
                    }
                    return todo;
                })
            case 'TOGGLE_ALL':
                return todos.map((todo) => {
                    return Object.assign({}, todo, {
                        completed: action.completed
                    })
                })
            default:
                return todos;
        }
    }

    function visibilityFilter(state = 'SHOW_ALL', action) {
        switch (action.type) {
            case 'SET_VISIBILITY_FILTER':
                return action.filter;
            default:
                return state;
        }
    }

    const todoApp = combineReducers({
        visibilityFilter,
        todos
    });
    const store = createStore(todoApp,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    const router = new Navigo(null, true, '#');
    router
        .on({
            'active': function() {
                store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ACTIVE' })
            },
            'completed': function() {
                store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_COMPLETED' })
            },
            '*': function() {
                store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' })
            }
        })
        .resolve();
    // just logging the store changes for observation
    const unsubscribe = store.subscribe(() => console.log(store.getState()))

    // Wiring the app to the elements
    let nextTodoId = 0;
    const addTodo = text => ({
        type: 'ADD_TODO',
        id: (nextTodoId++).toString(),
        text
    })
    const updateTodo = (id, text, completed) => ({
        type: 'UPDATE_TODO',
        id,
        text,
        completed
    })
    document.addEventListener('newitem', (e) => {
        e.target.tagName === 'NEW-TODO' && store.dispatch(addTodo(e.detail.value));
    })
    document.addEventListener('change', (e) => {
        e.target.tagName === 'TODO-ITEM' && store.dispatch(updateTodo(e.target.todoId, e.target.value, e.target.completed));
    })
    document.addEventListener('change', (e) => {
        e.target.tagName === 'TOGGLE-ALL' && store.dispatch({
            type: 'TOGGLE_ALL',
            completed: e.target.checked
        });
    })
    document.addEventListener('delete', (e) => {
        e.target.tagName === 'TODO-ITEM' && store.dispatch({
            type: 'DELETE_TODO',
            id:e.target.todoId
        });
    })
    document.addEventListener('click', (e) => {
        e.target.matches('button.clear-completed') && store.dispatch({
            type: 'CLEAR_COMPLETED_TODOS'
        });
    })
    

    // filter view helper
    const getVisibleTodos = (todos, filter) => {
        switch (filter) {
            case "SHOW_ALL":
                return todos
            case "SHOW_COMPLETED":
                return todos.filter(t => t.completed)
            case "SHOW_ACTIVE":
                return todos.filter(t => !t.completed)
            default:
                throw new Error('Unknown filter: ' + filter)
        }
    }
    
    const filterRoutes = {
        "SHOW_ALL":"",
        "SHOW_COMPLETED":"completed",
        "SHOW_ACTIVE":"active"
    }
    const routeForFilter = (filter) => {

    }
    // wire state changes to components
    store.subscribe(() => {
        let state = store.getState();
        // set the filter selectors - this is not custom elements
        [...document.querySelectorAll('.filters li a')].forEach(e=>e.classList.remove('selected'));
        document.querySelector(`.filters li a[href='#/${filterRoutes[state.visibilityFilter||"SHOW_ALL"]}']`).classList.add('selected');
        document.querySelector('todo-list').value = getVisibleTodos(state.todos, state.visibilityFilter);
        document.querySelector('todo-count').value = state.todos.filter(t=>!t.completed).length;
        document.querySelector('toggle-all').checked = (state.todos.filter(t=>!t.completed).length==0);
        document.querySelector('button.clear-completed').style.visibility=(state.todos.filter(t=>t.completed).length==0)?'hidden':'visible'
    });

    return store;
})();
