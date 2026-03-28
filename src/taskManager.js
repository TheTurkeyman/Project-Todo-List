import pubSub from './pubsub.js';

class Task {
  #id;
  #title;
  #dueDate;
  #project;
  #priority;

  constructor(title, dueDate, project, priority, id = null) {
    this.#id = id || Date.now().toString(); 
    this.#title = title;
    this.#dueDate = dueDate;
    this.#project = project;
    this.#priority = priority; 
  }

  getDetails() {
    return { 
        id: this.#id, 
        title: this.#title, 
        dueDate: this.#dueDate, 
        project: this.#project, 
        priority: this.#priority 
    };
  }
}

const taskManager = (() => {
  let tasks = [];
  let currentProject = 'All Todos';


  const saveToStorage = () => {
    const plainTasks = tasks.map(task => task.getDetails());
    localStorage.setItem('focus_tasks', JSON.stringify(plainTasks));
  };

  const loadFromStorage = () => {
    const storedTasks = JSON.parse(localStorage.getItem('focus_tasks'));
    
    if (storedTasks && storedTasks.length > 0) {
      tasks = storedTasks.map(data => 
        new Task(data.title, data.dueDate, data.project, data.priority, data.id)
      );
    } else {
      addTask('Finish Webpack Config', 'Today', 'Work', 'High');
      addTask('Buy groceries', 'Tomorrow', 'Personal', 'Low');
    }
  };


  const addTask = (title, dueDate, project, priority) => {
    const newTask = new Task(title, dueDate, project, priority);
    tasks.push(newTask);
    saveToStorage(); 
    publishUpdate();
  };

  const deleteTask = (id) => {
    tasks = tasks.filter(task => task.getDetails().id !== id);
    saveToStorage(); 
    publishUpdate();
  };

  const setCurrentProject = (projectName) => {
    currentProject = projectName;
    publishUpdate();
  };

  const publishUpdate = () => {
    let tasksToRender;
    if (currentProject === 'All Todos') {
      tasksToRender = tasks; 
    } else {
      tasksToRender = tasks.filter(task => task.getDetails().project === currentProject);
    }
    pubSub.publish('TASKS_UPDATED', { project: currentProject, tasks: tasksToRender });
  };

  pubSub.subscribe('REQUEST_DELETE_TASK', deleteTask);
  pubSub.subscribe('CHANGE_PROJECT', setCurrentProject);


  loadFromStorage();

  return { addTask };
})();

export default taskManager;