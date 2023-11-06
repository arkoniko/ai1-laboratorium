class Todo {
    constructor() {
        this.tasks = [];
        this.searchTerm = '';
        this.loadTasksFromLocalStorage();
    }
    draw() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        this.getFilteredTasks().forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span onclick="editTask(${index})">${this.highlightSearch(task)}</span>
 <span class="due-date">${task.dueDate}</span>
 <button onclick="deleteTask(${index})">Usuń</button>`;
            taskList.appendChild(li);
        });
    }
    addTask(newTask, dueDate) {
        if (this.validateTask(newTask, dueDate)) {
            this.tasks.push({ text: newTask, dueDate });
            this.saveTasksToLocalStorage();
            this.draw();
        } else {
            alert('Nieprawidłowa nazwa zadania lub jego data.');
        }
    }
    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasksToLocalStorage();
        this.draw();
    }
    editTask(index, newText, newDueDate) {
        if (this.validateTask(newText, newDueDate)) {
            this.tasks[index].text = newText;
            this.tasks[index].dueDate = newDueDate;
            this.saveTasksToLocalStorage();
            this.draw();
        } else {
            alert('Nieprawidłowa nazwa zadania lub jego data.');
        }
    }
    highlightSearch(task) {
        if (this.searchTerm) {
            const regex = new RegExp(`(${this.searchTerm})`, 'gi');
            return task.text.replace(regex, '<mark>$1</mark>');
        }
        return task.text;
    }
    getFilteredTasks() {
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
    validateTask(task, dueDate) {
        const validTask = task.trim().length >= 3 && task.trim().length <= 255;
        const validDate = this.validateDate(dueDate);
        return validTask && validDate;
    }
    validateDate(date) {
        const currentDate = new Date();
        const inputDate = new Date(date);
        return inputDate > currentDate;
    }
    loadTasksFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks);
        }
    }
    saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
 }
 const todo = new Todo();
 function addTask() {
    const newTaskInput = document.getElementById('newTask');
    const dueDateInput = document.getElementById('dueDate');
    todo.addTask(newTaskInput.value, dueDateInput.value);
    newTaskInput.value = '';
    dueDateInput.value = '';
 }
 function deleteTask(index) {
    todo.deleteTask(index);
 }
 function editTask(index) {
    const newText = prompt('Edycja Nazwy zadania:', todo.tasks[index].text);
    const newDueDate = prompt('Edycja Daty zadania:', todo.tasks[index].dueDate);
    if (newText !== null && newDueDate !== null) {
        todo.editTask(index, newText, newDueDate);
    }
 }
 function searchTasks() {
    const searchInput = document.getElementById('searchInput');
    todo.searchTerm = searchInput.value;
    todo.draw();
 }
 document.getElementById('searchInput').addEventListener('input', searchTasks);
 window.onload = function () {
    const dueDateInput = document.getElementById('dueDate');
    const currentDate = new Date();
    dueDateInput.min = currentDate.toISOString().slice(0, 16);
    todo.draw();
 };