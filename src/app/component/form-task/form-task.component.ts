import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TaskDto, TaskService} from "../../service/task.service";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-form-task',
  standalone: true,
  imports: [FormsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatCardModule],
  templateUrl: './form-task.component.html',
  styleUrl: './form-task.component.css'
})
export class FormTaskComponent {
  protected formTask = new FormGroup({
    labelField: new FormControl('', [Validators.required]),
    completeField: new FormControl(false, [Validators.required]),
  });

  constructor(private taskService: TaskService) {
  }


  onSubmit() {
    // Handle form submission here
    console.log(this.formTask.value);
    const taskDto: TaskDto = {
      label: this.formTask.get('labelField')!.value ?? '',
      complete: this.formTask.get('completeField')!.value ?? false,
    };
    this.taskService.createTask(taskDto).subscribe({
      next: resolve => {
        console.log('POST request successful:', resolve);
      },
      error: error => {
        console.error('Error occurred:', error);
      },
      complete: () => {
        this.taskService.setRefreshListTask(true);
      }
    });
    this.formTask.reset();
  }
}
