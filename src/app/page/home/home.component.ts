import {Component} from '@angular/core';
import {ListTaskComponent} from "../../component/list-task/list-task.component";
import {FormTaskComponent} from "../../component/form-task/form-task.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ListTaskComponent,
    FormTaskComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
