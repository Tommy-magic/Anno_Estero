/*
// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const menuList = document.getElementById('menu-list');

hamburger.addEventListener('click', function() {
    menuList.classList.toggle('nascosto');
    document.body.classList.toggle('menu-open');
});

// Chiudi il menu quando clicchi su un link
const menuLinks = menuList.querySelectorAll('a');
menuLinks.forEach(link => {
    link.addEventListener('click', function() {
        menuList.classList.add('nascosto');
        document.body.classList.remove('menu-open');
    });
});

// Chiudi il menu quando clicchi al di fuori
document.addEventListener('click', function(event) {
    const isClickInsideMenu = menuList.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnHamburger && !menuList.classList.contains('nascosto')) {
        menuList.classList.add('nascosto');
        document.body.classList.remove('menu-open');
    }
});

// Clock Icon Click Handler
const clockIcon = document.getElementById('clockIcon');
const countdownPopup = document.getElementById('countdown-popup');

if (clockIcon && countdownPopup) {
    clockIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Previene la chiusura immediata
        countdownPopup.style.display = countdownPopup.style.display === 'none' || countdownPopup.style.display === '' ? 'block' : 'none';
    });

    // Chiudi il popup quando si clicca fuori
    document.addEventListener('click', function(event) {
        if (!countdownPopup.contains(event.target) && !clockIcon.contains(event.target)) {
            countdownPopup.style.display = 'none';
        }
    });
}

// Slide Navigation
let currentSlide = 'home';

// Initialize slides - show only home initially
function initializeSlides() {
    const slides = document.querySelectorAll('section[class^="slide-"]');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    document.getElementById('home').classList.add('active');
}

// Navigate to slide
function navigateToSlide(targetId) {
    const currentSlideElement = document.getElementById(currentSlide);
    const targetSlideElement = document.getElementById(targetId);
    
    if (currentSlideElement && targetSlideElement) {
        // Remove active class from current slide
        currentSlideElement.classList.remove('active');
        
        // Add active class to target slide after a brief delay for smooth transition
        setTimeout(() => {
            targetSlideElement.classList.add('active');
            currentSlide = targetId;
        }, 50);
    }
}

// Add click handlers to menu links for slide navigation
menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1); // Remove the #
        navigateToSlide(targetId);
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSlides();
    initializeTodoList();
});

// Todo List Functionality
let tasks = [];
let currentFilter = 'all';

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('annoEsteroTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('annoEsteroTasks', JSON.stringify(tasks));
}

// Initialize todo list
function initializeTodoList() {
    loadTasks();
    renderTasks();
    updateBadges();
    
    // Add task button
    const addBtn = document.getElementById('add-btn');
    const newTaskInput = document.getElementById('new-task');
    
    addBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-f');
            setFilter(filter);
        });
    });
}

// Add new task
function addTask() {
    const input = document.getElementById('new-task');
    const text = input.value.trim();
    
    if (text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(task);
        saveTasks();
        renderTasks();
        updateBadges();
        input.value = '';
    }
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateBadges();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateBadges();
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-f="${filter}"]`).classList.add('active');
    
    renderTasks();
}

// Render tasks based on current filter
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    
    if (currentFilter === 'open') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'done') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="task-delete" onclick="deleteTask(${task.id})">×</button>
        `;
        
        taskList.appendChild(taskItem);
    });
}

// Update badge counters
function updateBadges() {
    const openCount = tasks.filter(t => !t.completed).length;
    const doneCount = tasks.filter(t => t.completed).length;
    
    document.getElementById('b-open').textContent = `${openCount} da fare`;
    document.getElementById('b-done').textContent = `${doneCount} fatte`;
}
*/

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const menuList = document.getElementById('menu-list');

hamburger.addEventListener('click', function() {
    menuList.classList.toggle('nascosto');
    document.body.classList.toggle('menu-open');
});

// Chiudi il menu quando clicchi su un link
const menuLinks = menuList.querySelectorAll('a');
menuLinks.forEach(link => {
    link.addEventListener('click', function() {
        menuList.classList.add('nascosto');
        document.body.classList.remove('menu-open');
    });
});

// Chiudi il menu quando clicchi al di fuori
document.addEventListener('click', function(event) {
    const isClickInsideMenu = menuList.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnHamburger && !menuList.classList.contains('nascosto')) {
        menuList.classList.add('nascosto');
        document.body.classList.remove('menu-open');
    }
});

// Clock Icon Click Handler
const clockIcon = document.getElementById('clockIcon');
const countdownPopup = document.getElementById('countdown-popup');

if (clockIcon && countdownPopup) {
    clockIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Previene la chiusura immediata
        countdownPopup.style.display = countdownPopup.style.display === 'none' || countdownPopup.style.display === '' ? 'block' : 'none';
    });

    // Chiudi il popup quando si clicca fuori
    document.addEventListener('click', function(event) {
        if (!countdownPopup.contains(event.target) && !clockIcon.contains(event.target)) {
            countdownPopup.style.display = 'none';
        }
    });
}

// Slide Navigation
let currentSlide = 'home';

// Initialize slides - show only home initially
function initializeSlides() {
    const slides = document.querySelectorAll('section[class^="slide-"]');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    document.getElementById('home').classList.add('active');
}

// Navigate to slide
function navigateToSlide(targetId) {
    const currentSlideElement = document.getElementById(currentSlide);
    const targetSlideElement = document.getElementById(targetId);
    
    if (currentSlideElement && targetSlideElement) {
        // Remove active class from current slide
        currentSlideElement.classList.remove('active');
        
        // Add active class to target slide after a brief delay for smooth transition
        setTimeout(() => {
            targetSlideElement.classList.add('active');
            currentSlide = targetId;
        }, 50);
    }
}

// Add click handlers to menu links for slide navigation
menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1); // Remove the #
        navigateToSlide(targetId);
    });
});

// Dynamic day display
function updateCurrentDay() {
    const el = document.getElementById('current-day');
    if (!el) return;
    const now = new Date();
    const formatted = now.toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    el.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSlides();
    initializeTodoList();
    updateCurrentDay();
});

// Todo List Functionality
let tasks = [];
let currentFilter = 'all';

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('annoEsteroTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('annoEsteroTasks', JSON.stringify(tasks));
}

// Initialize todo list
function initializeTodoList() {
    loadTasks();
    renderTasks();
    updateBadges();
    
    // Add task button
    const addBtn = document.getElementById('add-btn');
    const newTaskInput = document.getElementById('new-task');
    
    addBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-f');
            setFilter(filter);
        });
    });
}

// Add new task
function addTask() {
    const input = document.getElementById('new-task');
    const text = input.value.trim();
    
    if (text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(task);
        saveTasks();
        renderTasks();
        updateBadges();
        input.value = '';
    }
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateBadges();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateBadges();
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-f="${filter}"]`).classList.add('active');
    
    renderTasks();
}

// Render tasks based on current filter
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    
    if (currentFilter === 'open') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'done') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="task-delete" onclick="deleteTask(${task.id})">×</button>
        `;
        
        taskList.appendChild(taskItem);
    });
}

// Update badge counters
function updateBadges() {
    const openCount = tasks.filter(t => !t.completed).length;
    const doneCount = tasks.filter(t => t.completed).length;
    
    document.getElementById('b-open').textContent = `${openCount} da fare`;
    document.getElementById('b-done').textContent = `${doneCount} fatte`;
}
