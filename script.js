// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add Task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const time = date.toLocaleTimeString();
    return `Created: ${day}/${month}/${year} ${time}`;
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    // Create task element
    const taskItem = document.createElement('li');
    taskItem.className = 'task';

    // Task text
    const taskTextSpan = document.createElement('span');
    taskTextSpan.className = 'task-text';
    taskTextSpan.textContent = taskText;

    // Task metadata container (for time + delete button)
    const taskMeta = document.createElement('div');
    taskMeta.className = 'task-meta';

    // Creation timestamp
    const createdAt = new Date();
    const timeSpan = document.createElement('span');
    timeSpan.className = 'task-time';
    timeSpan.textContent = formatDate(createdAt);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', deleteTask);

    // Append elements
    taskMeta.appendChild(timeSpan);
    taskMeta.appendChild(deleteBtn);
    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(taskMeta);
    taskList.appendChild(taskItem);


    // Toggle completion on click
    taskItem.addEventListener('click', toggleComplete);

    // Save to localStorage
    saveTask(taskText, createdAt);

    // Clear input
    taskInput.value = '';
}

function deleteTask(e) {
    // Find the task item
    const taskItem = e.target.closest('.task');
    if (!taskItem) return;
  
    // Add animation
    taskItem.style.transition = 'opacity 0.3s';
    taskItem.style.opacity = '0';
  
    // Remove after animation completes
    setTimeout(() => {
      const taskText = taskItem.querySelector('.task-text').textContent;
      taskItem.remove();
      removeTaskFromStorage(taskText);
    }, 300);
  }

function toggleComplete(e) {
    if (e.target.tagName === 'BUTTON') return; // Ignore delete button clicks
    const taskItem = e.currentTarget;
    const isNowCompleted = !taskItem.classList.contains('completed');
    taskItem.classList.toggle('completed');

    // Update timestamp if task was just completed
    if (isNowCompleted) {
        const timeSpan = taskItem.querySelector('.task-time');
        const completedAt = new Date();
        timeSpan.textContent += ` | Completed: ${formatDate(completedAt)}`;
    }

    updateTaskInStorage(taskItem, isNowCompleted);
}

// LocalStorage Functions
function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: task, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task';
        if (task.completed) taskItem.classList.add('completed');

        // Task text
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;

        // Task metadata
        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';

        // Time display
        const timeSpan = document.createElement('span');
        timeSpan.className = 'task-time';

        const createdAt = new Date(task.createdAt);
        let timeText = formatDate(createdAt);

        if (task.completed && task.completedAt) {
            const completedAt = new Date(task.completedAt);
            timeText += ` | Completed: ${formatDate(completedAt)}`;
        }

        timeSpan.textContent = timeText;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', deleteTask);

        // Assemble
        taskMeta.appendChild(timeSpan);
        taskMeta.appendChild(deleteBtn);
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(taskMeta);
        taskList.appendChild(taskItem);

        taskItem.addEventListener('click', toggleComplete);
    });
}

function removeTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInStorage(taskItem, isNowCompleted) {
    const taskText = taskItem.querySelector('.task-text').textContent;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.text === taskText);

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = taskItem.classList.contains('completed');
        if (isNowCompleted) {
            tasks[taskIndex].completedAt = new Date().getTime();
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

