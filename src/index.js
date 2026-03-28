
import './style.css';
import pubSub from './pubsub.js';
import taskManager from './taskManager.js';
import './ui.js'; 

const addBtn = document.getElementById('add-btn');
const modal = document.getElementById('task-modal');
const form = document.getElementById('task-form');
const cancelBtn = document.getElementById('cancel-btn');


const sidebarItems = document.querySelectorAll('.project-list li');
sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const projectName = e.target.textContent;
        pubSub.publish('CHANGE_PROJECT', projectName); 
    });
});


addBtn.addEventListener('click', () => modal.showModal());

cancelBtn.addEventListener('click', () => {
    modal.close();
    form.reset(); 
});



form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const titleInput = document.getElementById('task-title').value;
    const dateInput = document.getElementById('task-date').value;
    
    const projectInput = document.querySelector('input[name="task-category"]:checked').value;
    const priorityInput = document.querySelector('input[name="task-priority"]:checked').value;

    taskManager.addTask(titleInput, dateInput, projectInput, priorityInput);

    modal.close();
    form.reset();
});


pubSub.publish('CHANGE_PROJECT', 'All Todos');