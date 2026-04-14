let undoStack = [];
let redoStack = [];
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Select DOM Elements ---
    const taskInput = document.getElementById('task-input');
    const listToDo = document.getElementById('listToDo');
    const listToDoCompleted = document.getElementById('listToDoCompleted'); 
    const progressBarFill = document.getElementById('progressBarFill');
    const progressPercent = document.getElementById('progressPercent');
    let currentSortMode = 'default';
    const sortSelect = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input');
    const toggleBtn = document.getElementById('toggle-completed');
    const completedHeader = document.getElementById('completed-header');

    // --- 2. Select Modal Elements ---
    const editModal = document.getElementById('editModal');
    const closeModal = document.querySelector('#editModal .close-btn'); 
    const saveEditBtn = document.getElementById('save-edit-btn');
    const editText = document.getElementById('edit-task-text');
    const editPriority = document.getElementById('edit-task-priority');
    const editCategory = document.getElementById('edit-task-category');
    const editDueDate = document.getElementById('edit-task-dueDate');
    let currentEditIndex = null; 

    // --- 3. State & Configuration ---
    const VALID_PRIORITIES = ['minimal', 'normal', 'critical'];
    let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const tasks = savedTasks.filter(t => t.type !== 'event');


    sortSelect.addEventListener('change', (e) => {
        currentSortMode = e.target.value;
        renderTasks(); // Re-render immediately when selection changes
    });

    searchInput.addEventListener('input', () => {
        renderTasks(); // Re-render as the user types
    });

    const isHidden = localStorage.getItem('completedHidden') === 'true';
    if (isHidden) {
        listToDoCompleted.classList.add('hidden');
        toggleBtn.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
        const isNowHidden = listToDoCompleted.classList.toggle('hidden');
        toggleBtn.classList.toggle('collapsed');
        
        // Save preference to localStorage
        localStorage.setItem('completedHidden', isNowHidden);
    });

    // Toggle Logic
    completedHeader.addEventListener('click', () => {
        const isNowHidden = listToDoCompleted.classList.toggle('hidden');
        toggleBtn.classList.toggle('collapsed');
        localStorage.setItem('completedHidden', isNowHidden);
    });

    // Initial state check
    if (localStorage.getItem('completedHidden') === 'true') {
        listToDoCompleted.classList.add('hidden');
        toggleBtn.classList.add('collapsed');
    }

    // --- 4. Core Functions ---

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateDashboardMetrics();
    }

    function updateDashboardMetrics() {
        // 1. Calculate how many tasks have 'completed: true'
        const completedTasks = tasks.filter(t => t.completed === true).length;
        const totalTasks = tasks.length;
        const incompleteTasks = totalTasks - completedTasks;
    
        // 2. Update the counter pill (Check this ID matches your HTML!)
        const counterPill = document.getElementById('completed-count');
        if (counterPill) {
            counterPill.textContent = completedTasks;
        }
    
        // 3. Update the To-Do counter
        const todoCounter = document.getElementById('todo-count');
        if (todoCounter) {
            todoCounter.textContent = incompleteTasks;
        }
    
        // 4. Update Progress Bar
        if (progressBarFill) {
            // Weighted logic (Optional, keep if you liked it!)
            const weights = { 'critical': 5, 'normal': 2, 'minimal': 1 };
            const totalWeight = tasks.reduce((sum, t) => sum + (weights[t.priority] || 2), 0);
            const completedWeight = tasks.filter(t => t.completed).reduce((sum, t) => sum + (weights[t.priority] || 2), 0);
            
            const percentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
            progressBarFill.style.width = percentage + "%";
            progressPercent.textContent = percentage + "%";
        }
    }
    

    function addTask() {
        const text = taskInput.value.trim();
        if (text !== '') {
            tasks.push({
                id: Date.now(), // This gives every task a unique number!
                text: text,
                completed: false,
                priority: 'normal',
                dueDate: null,
                category: 'personal'
            });
            taskInput.value = '';
            saveTasks();
        }
    }
    

    // --- 5. UI Rendering ---

    function renderTasks() {
        const searchTerm = (searchInput.value || "").toLowerCase(); // Safe check for search text
        listToDo.innerHTML = '';
        listToDoCompleted.innerHTML = '';
    
        // 1. Sort the entire array first
        tasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
            const prioA = VALID_PRIORITIES.indexOf(a.priority);
            const prioB = VALID_PRIORITIES.indexOf(b.priority);
    
            switch (currentSortMode) {
                case 'dateOnly': return dateA - dateB;
                case 'category':
                    const catSort = a.category.localeCompare(b.category);
                    if (catSort !== 0) return catSort;
                    if (prioA !== prioB) return prioB - prioA;
                    return dateA - dateB;
                default:
                    if (prioA !== prioB) return prioB - prioA;
                    return dateA - dateB;
            }
        });
    
        // 2. NOW loop through and apply the filter check INSIDE
        tasks.forEach((task, index) => {
            // --- MOVE THE FILTER LOGIC HERE ---
            const matchesText = task.text.toLowerCase().includes(searchTerm);
            const matchesCategory = task.category.toLowerCase().includes(searchTerm);
    
            if (!matchesText && !matchesCategory) {
                return; // Skip this specific task and move to the next one
            }
            // ----------------------------------
    
            // ... rest of your element creation code (taskItem, taskDetails, etc.)
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.classList.add(`priority-${task.priority}`); 
            if (task.completed) taskItem.classList.add('completed-task');
            
            // ... (Keep the rest of your original creation code exactly as it was)
            const taskDetails = document.createElement('div');
            taskDetails.classList.add('task-details');
            
            const taskText = document.createElement('button');
            taskText.classList.add('task-text');
            taskText.textContent = task.text;
            taskText.onclick = function listenForClick() {
                undoStack.push({ id: task.id, prevState: task.completed });
                redoStack = []; 
                task.completed = !task.completed;
                saveTasks();
            };
            
    
            const categoryTag = document.createElement('span');
            categoryTag.classList.add('category-tag');
            categoryTag.textContent = task.category;
    
            const dueDate = document.createElement('span');
            dueDate.classList.add('due-date');
            dueDate.textContent = task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString() : 'No Due Date';
    
            const priorityTag = document.createElement('span');
            priorityTag.classList.add('priority-tag', `priority-${task.priority}`);
            priorityTag.textContent = task.priority;
    
            taskDetails.appendChild(categoryTag);
            taskDetails.appendChild(taskText);
            taskDetails.appendChild(dueDate);
            taskDetails.appendChild(priorityTag);
    
            const taskActions = document.createElement('div');
            taskActions.classList.add('task-actions');
    
            const editBtn = document.createElement('button');
            editBtn.classList.add('action-btn', 'edit-btn');
            editBtn.textContent = '✏️';
            editBtn.onclick = () => openEditModal(index);
    
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('action-btn', 'delete-btn');
            deleteBtn.textContent = 'X';
            deleteBtn.onclick = () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    tasks.splice(index, 1);
                    saveTasks();
                }
            };
    
            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);
            taskItem.appendChild(taskDetails);
            taskItem.appendChild(taskActions);
            
            if (task.completed) {
                listToDoCompleted.appendChild(taskItem);
            } else {
                listToDo.appendChild(taskItem);
            }
        });
    }
    

    // --- 6. Modal Handlers ---

    function openEditModal(index) {
        currentEditIndex = index;
        const task = tasks[index];
        editText.value = task.text;
        editPriority.value = task.priority;
        editCategory.value = task.category;
        editDueDate.value = task.dueDate || ''; 
        editModal.classList.remove('hidden'); 
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
        currentEditIndex = null;
    }

    // --- 7. Event Listeners ---

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    closeModal.addEventListener('click', closeEditModal);

    saveEditBtn.addEventListener('click', () => {
        if (currentEditIndex !== null) {
            tasks[currentEditIndex].text = editText.value.trim();
            tasks[currentEditIndex].priority = editPriority.value;
            tasks[currentEditIndex].category = editCategory.value;
            tasks[currentEditIndex].dueDate = editDueDate.value || null;
            saveTasks();
            closeEditModal();
        }
    });
    

    window.addEventListener('click', (event) => {
        if (event.target === editModal) closeEditModal();
    });

    document.addEventListener('keydown', (e) => {
        const isZ = e.key.toLowerCase() === 'z';
        const isY = e.key.toLowerCase() === 'y';
        const isCtrl = e.ctrlKey || e.metaKey;
    
        // --- Undo (Ctrl + Z) ---
        if (isCtrl && isZ && !e.shiftKey) {
            e.preventDefault();
            if (undoStack.length > 0) {
                const action = undoStack.pop();
                const task = tasks.find(t => t.id === action.id);
                if (task) {
                    redoStack.push({ id: task.id, prevState: task.completed });
                    task.completed = action.prevState;
                    saveTasks();
                }
            }
        }
    
        // --- Redo (Ctrl + Y or Ctrl + Shift + Z) ---
        if (isCtrl && (isY || (isZ && e.shiftKey))) {
            e.preventDefault();
            if (redoStack.length > 0) {
                const action = redoStack.pop();
                const task = tasks.find(t => t.id === action.id);
                if (task) {
                    undoStack.push({ id: task.id, prevState: task.completed });
                    task.completed = action.prevState;
                    saveTasks();
                }
            }
        }
    });
    
    // --- 8. Initialization ---
    closeEditModal();
    renderTasks();
    updateDashboardMetrics();
});
