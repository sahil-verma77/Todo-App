const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const formBtn = document.querySelector("#form-btn");
const taskCount = document.querySelector("#task-count");
const completeCount = document.querySelector("#complete-count");

// "Go to gym", "Revision Web Dev", "Take Class"
// {
//     id: Date.now() + 1,
//     text: "Go to gym",
//     isCompleted: false
// }, {
//     id: Date.now() + 2,
//     text: "Revision Web Dev",
//     isCompleted: true
// }, {
//     id: Date.now() + 3,
//     text: "Take Class",
//     isCompleted: false
// }
let todos = JSON.parse(localStorage.getItem("todos")) || [];

let editTodoId = null; // flag

todoForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const todoValue = todoInput.value.trim();

    // Agar todo ki value empty hai means "" then we do !"" --> true ans ! is logical NOT operator
    if (!todoValue) {
        return;
    }
    console.log({ editTodoId, todoValue });

    if (editTodoId) {
        // // editing
        todos = todos.map((todo) => {
            if (todo.id === Number(editTodoId)) {
                return {
                    ...todo,
                    text: todoValue
                }
            }
            return todo;
        })

        localStorage.setItem("todos", JSON.stringify(todos));
    }
    else {
        // // adding
        let newTodo = {
            id: Date.now(),
            text: todoValue,
            isCompleted: false
        }
        todos.push(newTodo); // Adding new todo to existing todos list
        localStorage.setItem("todos", JSON.stringify(todos));

        // todos.push({
        //     id: Date.now(),
        //     text: todoValue,
        //     isCompleted: false
        // })
    }

    todoInput.value = "";
    renderTodo(); // Jab koi naya todo add hoga firse updated todos render ho jayenge
})

function renderTodo() {
    todoList.innerHTML = "";
    // // Or
    // todoList.textContent = "";
    todos.forEach((todo) => {
        const li = document.createElement('li');

        // li.setAttribute("class", "flex gap-2 border border-slate-300 p-4 rounded-xl");
        // // Or
        li.className = "flex gap-2 border border-slate-300 p-4 rounded-xl";

        // li.setAttribute("data-id", todo.id); // This is jugaad
        // // Or
        li.dataset.id = todo.id; // This is original method

        li.innerHTML = `
        <input data-action="toggle" ${todo.isCompleted ? "checked" : ""} type="checkbox" id="check">
        <p class="flex-1 ${todo.isCompleted ? "line-through text-red-400" : ""}">${todo.text}</p>
        <div class="flex gap-2">
            <button data-action="edit">Edit</button>
            <button data-action="delete">Delete</button>
        </div>
        `

        todoList.append(li); // here we want exact/valid html code
    })
    taskCount.textContent = `TASKS (${todos.length})`;
    completeCount.textContent = `COMPLETED : ${todos.filter((todo) => todo.isCompleted).length}`
}

renderTodo(); // Jab first time file execute hogi tab existing todos render ho jayenge


// Event Delegation :-
todoList.addEventListener('click', (e) => {
    e.stopPropagation();

    // console.log(e.target); // e.target --> jis element par click karte ho
    // console.log(e.currentTarget); // e.currentTarget --> jis element par addEventListener attached hai

    // console.log(e.target.parentElement);

    const li = e.target.closest('li');
    const id = li.dataset.id;

    // console.log(e.target.tagName);

    let action = e.target.dataset.action;

    if (action === "delete") {
        deleteTodo(id);
    }

    if (action === "edit") {
        startEdit(id);
    }

    if (action === "toggle") {
        todos = todos.map((todo) => {
            if (todo.id === Number(id)) {
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted
                }
            }
            return todo;
        })
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodo();
    }
})

function deleteTodo(id) {
    todos = todos.filter((todo) => {
        if (todo.id !== Number(id)) {
            return todo;
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodo();
}
function startEdit(id) {
    editTodoId = id;0

    let currentTodo = todos.find((todo) => {
        if (todo.id === Number(id)) {
            return todo;
        }
    })

    todoInput.value = currentTodo.text;

    formBtn.textContent = "Update";
}