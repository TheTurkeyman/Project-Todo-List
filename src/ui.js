import pubSub from './pubsub.js';

const uiController = (() => {
  const taskListElement = document.getElementById('task-list');
  const headerTitle = document.querySelector('header h1');
  const sidebarItems = document.querySelectorAll('.project-list li');

  
  const renderTasks = (data) => {
    headerTitle.textContent = data.project; 
    taskListElement.innerHTML = ''; 
    
    data.tasks.forEach(taskObj => {
      const task = taskObj.getDetails();
      const taskEl = document.createElement('div');
      
      taskEl.className = `task-item ${task.priority === 'High' ? 'highlight-high' : ''}`;
      
      taskEl.innerHTML = `
        <div class="task-info">
          <input type="checkbox" class="task-check">
          <div class="task-text-group">
            <span class="task-title">${task.title}</span>
            <span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
          </div>
        </div>
        <div class="task-meta">
          <span class="task-date">${task.dueDate}</span>
          <button class="delete-btn" data-id="${task.id}">✕</button>
        </div>
      `;
      
      taskListElement.appendChild(taskEl);
    });
   
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = e.target.getAttribute('data-id');
        pubSub.publish('REQUEST_DELETE_TASK', taskId);
      });
    });

   
    sidebarItems.forEach(item => {
      item.classList.remove('active');
      if (item.textContent === data.project) {
        item.classList.add('active');
      }
    });
  };

  pubSub.subscribe('TASKS_UPDATED', renderTasks);

  return { renderTasks };
})();

export default uiController;