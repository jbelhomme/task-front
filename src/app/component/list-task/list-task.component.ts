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
  tasksSource!: MatTableDataSource<TaskDto, MatPaginator>;

  protected page = 0;
  protected pageIndex = 0;
  protected pageSize = 5;
  protected displayedColumns: string[] = ['id', 'label', 'complete'];
  protected length?: number;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    // this.taskService.getTaskById(1).subscribe((data) => { this.task = data; });
    this.tasksSource = new MatTableDataSource<TaskDto>();
    this.getListTasks();
  }

  public ngAfterViewInit(): void {
    this.tasksSource.paginator = this.paginator;
  }

  /**
   * Get tasks after change params of table
   * @param e page event
   */
  protected async handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.page = e.pageIndex;
    await this.getListTasks();
  }

  /**
   * Get tasks after change params of table
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
  private async getListTasks() {
    this.taskService.getAllTasks(this.page, this.pageSize, false).subscribe((data: ListTasks<TaskDto>) => {
      this.tasksSource.data = data.content;
      if (data.totalElements != null && data.totalPages != null) {
        this.length = data.totalElements;
      }
    });
  }
}
