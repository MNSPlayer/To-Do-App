// js/script.js
const todoInput = document.getElementById("todo-input");
const todoDate = document.getElementById("todo-date");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filter = document.getElementById("filter");
const clearBtn = document.getElementById("clear-btn");

let todos = [];

// LocalStorage helpers
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function loadFromLocalStorage() {
  const raw = localStorage.getItem("todos");
  todos = raw ? JSON.parse(raw) : [];
}

// ID generator
function generateId() {
  return Date.now() + Math.random().toString(36).slice(2, 9);
}

// Add Task
addBtn.addEventListener("click", () => {
  const task = todoInput.value.trim();
  const date = todoDate.value;

  if (!task) {
    alert("Please enter a task.");
    return;
  }

  const newTodo = { id: generateId(), task, date, completed: false };
  todos.push(newTodo);
  saveToLocalStorage();
  todoInput.value = "";
  todoDate.value = "";
  renderList();
});

// Fitur Delete task
function deleteTask(id) {
  todos = todos.filter(t => t.id !== id);
  saveToLocalStorage();
  renderList();
}

// Fitur Delete ALL tasks
function deleteAllTasks() {
  console.log("Delete all clicked!");
  if (todos.length === 0) {
    alert("No tasks to delete.");
    return;
  }
  if (confirm("Are you sure you want to delete ALL tasks? This cannot be undone.")) {
    todos = [];
    console.log("Todos cleared:", todos);
    saveToLocalStorage();
    renderList();
  }
}

// Toggle complete
function toggleComplete(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveToLocalStorage();
  renderList();
}

// Filter change
filter.addEventListener("change", renderList);

// Bind delete-all button
clearBtn.addEventListener("click", deleteAllTasks);

// Render function
function renderList() {
  const f = filter.value;
  let list = todos;
  if (f === "pending") list = todos.filter(t => !t.completed);
  else if (f === "completed") list = todos.filter(t => t.completed);

  if (list.length === 0) {
    todoList.innerHTML = `<tr><td colspan="4" class="empty">No task found</td></tr>`;
    return;
  }

  todoList.innerHTML = list.map(t => `
    <tr>
      <td>${escapeHtml(t.task)}</td>
      <td>${t.date || "-"}</td>
      <td>${t.completed ? "✅ Completed" : "⌛ Pending"}</td>
      <td>
        <button class="action-btn complete-btn" onclick="toggleComplete('${t.id}')">
          ${t.completed ? "Undo" : "Done"}
        </button>
        <button class="action-btn delete-btn" onclick="deleteTask('${t.id}')">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// On load
window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  renderList();
});

// Expose functions to global scope to keep inline onclick working
window.deleteTask = deleteTask;
window.deleteAllTasks = deleteAllTasks;
window.toggleComplete = toggleComplete;
