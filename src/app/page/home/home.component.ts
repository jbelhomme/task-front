import {Component} from '@angular/core';
import {ListTaskComponent} from "../../component/list-task/list-task.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ListTaskComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
