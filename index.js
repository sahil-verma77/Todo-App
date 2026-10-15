const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const formBtn = document.querySelector("#form-btn");
const cancelBtn = document.querySelector("#cancel-btn");
const taskCount = document.querySelector("#task-count");
const completeCount = document.querySelector("#complete-count");
const todoList = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");
const progressText = document.querySelector("#progress-text");
const progressTrack = document.querySelector("#progress-track");
const progressBar = document.querySelector("#progress-bar");

let todos = JSON.parse(localStorage.getItem("todos")) || []; // Array of Todos
let editTodoId = null; // flag

todoForm.addEventListener("submit", (e) => { // Add & Update Button
    e.preventDefault();

    const todoValue = todoInput.value.trim();
    if (!todoValue) { // Check if Todo is Valid or Not
        return;
    }

    if (editTodoId) { // Editing
        todos = todos.map((todo) => {
            if (todo.id === Number(editTodoId)) {
                return { ...todo, text: todoValue }; // Spread Operator
            }
            return todo;
        })
        localStorage.setItem("todos", JSON.stringify(todos));
    } else { // Adding
        let newTodo = {
            id: Date.now(),
            text: todoValue,
            isCompleted: false
        };

        todos.push(newTodo); // Add new Todo to existing Todos Array
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    cancelEdit();
    renderTodo();
})

function renderTodo() {
    todoList.innerHTML = ""; // Empty Todos from HTML code

    todos.forEach((todo) => { // Add Todos to HTML code
        const li = document.createElement("li");
        li.className = "flex flex-wrap items-center gap-3 border border-slate-200 bg-white p-4 rounded-xl shadow-sm transition-colors hover:border-blue-200";
        li.dataset.id = todo.id;

        li.innerHTML = `
            <input type="checkbox" class="h-4 w-4 shrink-0 accent-blue-600 cursor-pointer" ${todo.isCompleted ? "checked" : ""} data-action="toggle">

            <p class="min-w-0 flex-1 break-words text-sm ${todo.isCompleted ? "line-through text-blue-600 font-medium" : "text-slate-800 font-medium"}">${todo.text}</p>

            <div class="flex shrink-0 gap-2">
                <button
                    class="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    data-action="edit">Edit</button>
                <button
                    class="px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                    data-action="delete">Delete</button>
            </div>`;
        todoList.append(li);
    })

    if (todos.length === 0) { // Empty Message
        emptyMessage.classList.remove("hidden");
    } else {
        emptyMessage.classList.add("hidden");
    }

    const completedTodos = todos.filter((todo) => todo.isCompleted).length;

    taskCount.textContent = `TASKS (${todos.length})`;
    completeCount.textContent = `COMPLETED : ${completedTodos}`;

    // Calculate task progress
    let progress = 0;

    if (todos.length > 0) {
        progress = Math.round((completedTodos / todos.length) * 100);
    }

    // Update progress bar
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;
    progressTrack.setAttribute("aria-valuenow", progress);
}

renderTodo();

todoList.addEventListener("click", (e) => {
    e.stopPropagation();

    const currentLi = e.target.closest("li"); // Find closest parent '<li>' to find it's ID
    const currentId = currentLi.dataset.id;

    const action = e.target.dataset.action; // Find Delete Button Element

    if (action === "delete") { // Delete Button
        deleteTodo(currentId);
    }

    if (action === "edit") { // Edit Button
        startEdit(currentId);
    }

    if (action === "toggle") {
        todos = todos.map((todo) => {
            if (todo.id === Number(currentId)) {
                return { ...todo, isCompleted: !(todo.isCompleted) }; // Spread Operator
            }
            return todo;
        })
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodo();
    }
})

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== Number(id));
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodo();
}

function startEdit(id) {
    editTodoId = id;

    const currentTodo = todos.find((todo) => todo.id === Number(id));
    todoInput.value = currentTodo.text;

    todoInput.focus();

    formBtn.textContent = "Update";
    formBtn.className = "inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer";
    cancelBtn.classList.remove("hidden");
}

function cancelEdit() {
    editTodoId = null;

    todoInput.value = "";

    formBtn.textContent = "Add";
    formBtn.className = "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] cursor-pointer";
    formBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14" />
        </svg>Add Task`;

    cancelBtn.classList.add("hidden");
}

cancelBtn.addEventListener("click", () => {
    cancelEdit();
})