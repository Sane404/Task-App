import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks;
  formVisible:boolean = false;
  userID:string;
  selectOptions = [ 'Select Priority' ,'All', 'Low' , 'Medium' , 'High'];
  constructor(private fb:FormBuilder, private auth : AuthService) { }
  ngOnInit(): void {
    this.userID = JSON.parse(localStorage.getItem('user')).uid;
    console.log(this.userID);
    
    this.getTasks();
  }
  task = this.fb.group({
    task_name: ['' , [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/)]],
    prio: ['Medium', Validators.required]
  });
  submit(form){
    if(form.status == 'VALID'){
      let ID = JSON.parse(localStorage.getItem('user')).uid;
      let task_name = form.value.task_name;
      let task_priority = form.value.prio;
      let task = {
        task:task_name,
        priority:task_priority,
        time:new Date(),
        completed: false
      }
      this.auth.updateTasksArray(ID,task);
      this.getTasks();
      this.formVisibility();
    }
  }
  get taskname(){return this.task.get('task_name')}
  getTasks(){
    this.auth.getCollection(this.userID).then(data=>{
      data.data().tasks ? this.tasks = data.data().tasks : this.tasks = [];
      if(this.tasks != []){
        this.tasks.sort(function(a, b){return a.time.seconds - b.time.seconds});
      }
    });
  }
  formVisibility(){
    this.formVisible = !this.formVisible;
  }
  removeTask(task){
    this.auth.removeTaskFromArray(this.userID,task);
    this.getTasks();
  }
  checkBoxValue(e,task){
    this.auth.removeTaskFromArray(this.userID,task);
    task.completed = e.target.checked;
    this.auth.updateTasksArray(this.userID,task);
  }
  filter(e){
    let filterValue = e.target.value.toLowerCase();
    let allTasks = document.querySelectorAll('.task');
    allTasks.forEach((task:HTMLElement) =>{
      if(filterValue == 'all'){
        task.style.display = 'block';
      }else{
        task.classList.contains(filterValue) ? task.style.display = 'block' :  task.style.display = 'none';
      }
      
    })
  }
  getTime(time){
    let date = new Date(time * 1000).toString();
    let date_string = date.split(' ').splice(0,5).join(' ');
    return date_string;
  }
}
