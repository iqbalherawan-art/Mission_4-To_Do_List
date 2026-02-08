let tasks = [];
let currentFilter = 'all';

function updateLiveDate() {
            const liveDate = document.getElementById('liveDate');
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            liveDate.textContent = now.toLocaleDateString('en-US', options);
        }

function isTaskExpired(dueDate) {
            if (!dueDate) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const due = new Date(dueDate);
            due.setHours(0, 0, 0, 0);
            return due < today;
        }
function formatDate(dateString) {
            if (!dateString) return 'No date';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
function addTask() {
            const taskInput = document.getElementById('taskInput');
            const dueDate = document.getElementById('dueDate').value;
            const priority = document.getElementById('prioritySelect').value;
            const status = document.getElementById('statusSelect').value;
if (taskInput.value.trim() === '') {
                alert('Please enter a task!');
                return;
            }

            if (!dueDate) {
                alert('Please select a due date!');
                return;
            }

            const newTask = {
                id: Date.now(),
                text: taskInput.value.trim(),
                priority: priority,
                status: status,
                dueDate: dueDate
};

tasks.push(newTask);
            taskInput.value = '';
            document.getElementById('dueDate').value = '';
            document.getElementById('prioritySelect').value = 'Medium';
            document.getElementById('statusSelect').value = 'will be done';

renderTasks();
}

function deleteTask(id) {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        }

function completeTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.status = task.status === 'will be done' ? 'worked on' : 'will be done';
                renderTasks();
            }
        }

function deleteAllTasks() {
            if (tasks.length === 0) {
                alert('No tasks to delete!');
                return;
            }
            if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
                tasks = [];
                renderTasks();
            }
        }

function filterTasks(filterType) {
            currentFilter = filterType;
            
            // Update button styles
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            renderTasks();
        }
function getPriorityClass(priority) {
            return `priority-${priority.toLowerCase()}`;
        }
function getStatusClass(status, expired) {
            if (expired && status === 'will be done') {
                return 'status-expired';
            }
            return status === 'worked on' ? 'status-completed' : 'status-pending';
        }
function getStatusText(status, expired) {
            if (expired && status === 'will be done') {
                return '⏰ EXPIRED';
            }
            return status;
        }      
function getFilteredTasks() {
            if (currentFilter === 'all') {
                return tasks;
            } else if (currentFilter === 'pending') {
                return tasks.filter(t => t.status === 'will be done');
            } else if (currentFilter === 'completed') {
                return tasks.filter(t => t.status === 'worked on');
            } else {
                // Filter by priority
                return tasks.filter(t => t.priority === currentFilter);
            }
        }          

function sortTasks(taskList) {
            const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
            return taskList.sort((a, b) => {
                // Sort by expiration status first (expired first)
                const aExpired = isTaskExpired(a.dueDate) && a.status === 'will be done' ? 1 : 0;
                const bExpired = isTaskExpired(b.dueDate) && b.status === 'will be done' ? 1 : 0;
                if (aExpired !== bExpired) return bExpired - aExpired;
                
                // Then by priority
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return 0;
            });
        }        
function renderTasks() {
            const activeTasks = sortTasks(getFilteredTasks().filter(t => t.status === 'will be done'));
            const completedTasks = sortTasks(getFilteredTasks().filter(t => t.status === 'worked on'));

            const todoBody = document.getElementById('todoBody');
            const completedBody = document.getElementById('completedBody');

            // Render active tasks
            if (activeTasks.length === 0) {
                todoBody.innerHTML = '<tr><td colspan="5" class="empty-message">No active tasks.</td></tr>';
            } else {
                todoBody.innerHTML = activeTasks.map(task => {
                    const expired = isTaskExpired(task.dueDate);
                    return `
                    <tr>
                        <td>${task.text}</td>
                        <td>${formatDate(task.dueDate)}</td>
                        <td><span class="${getPriorityClass(task.priority)}">${task.priority}</span></td>
                        <td><span class="${getStatusClass(task.status, expired)}">${getStatusText(task.status, expired)}</span></td>
                        <td>
                            <div class="button-group">
                                <button class="btn-complete" onclick="completeTask(${task.id})">✓ Done</button>
                                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
                }).join('');
            }

            // Render completed tasks
            if (completedTasks.length === 0) {
                completedBody.innerHTML = '<tr><td colspan="5" class="empty-message">No completed tasks yet.</td></tr>';
            } else {
                completedBody.innerHTML = completedTasks.map(task => `
                    <tr>
                        <td>${task.text}</td>
                        <td>${formatDate(task.dueDate)}</td>
                        <td><span class="${getPriorityClass(task.priority)}">${task.priority}</span></td>
                        <td><span class="${getStatusClass(task.status, false)}">${task.status}</span></td>
                        <td>
                            <div class="button-group">
                                <button class="btn-complete" onclick="completeTask(${task.id})">↩️ Undo</button>
                                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }      
document.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' && document.getElementById('taskInput') === document.activeElement) {
                addTask();
            }
        });          
updateLiveDate();
setInterval(updateLiveDate, 1000);

