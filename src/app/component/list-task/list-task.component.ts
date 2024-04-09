import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {ListTasks, TaskDto, TaskService} from "../../service/task.service";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-list-task',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.css'
})
export class ListTaskComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  tasksSource!: MatTableDataSource<TaskDto>;

  protected page = 0;
  protected pageSize = 10;
  protected displayedColumns: string[] = ['id', 'label', 'complete'];
  protected length?: number;

  protected completeCriteria: boolean = false;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {

    this.getListTasks();
    this.taskService.getRefreshListTask().subscribe(refresh => {
      if (refresh) {
        this.getListTasks();
      }
    })
  }

  public ngAfterViewInit(): void {
    this.tasksSource.paginator = this.paginator;
  }

  /**
   * Refresh list of tasks after change page or size page
   * @param event page event
   */
  protected async handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex;
    await this.getListTasks();
  }

  /**
   * Update task status
   * @param row task dto
   */
  protected async updateStatusTask(row: TaskDto) {
    this.taskService.updateTask(row).subscribe({
      next: resolve => {
        console.log('PUT request successful:', resolve);
      },
      error: error => {
        console.error('Error occurred:', error);
      },
      complete: () => {
        this.getListTasks();
      }
    });
  }

  /**
   * Get the tasks with current filters and pagination
   */
  public async getListTasks() {
    this.taskService.getAllTasks(this.page, this.pageSize, this.completeCriteria).subscribe((data: ListTasks<TaskDto>) => {
      this.tasksSource = new MatTableDataSource<TaskDto>(data.content);
      this.length = data.totalElements;
      console.log(this.length, this.page, this.pageSize);
    });
  }

  /**
   * Change the current filter on the status with the opposite
   */
  protected async filterListOnComplete() {
    this.completeCriteria = !this.completeCriteria;
    this.page = 0;
    await this.getListTasks();
  }
}
