import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private refreshListTask: BehaviorSubject<boolean>;

  constructor(protected httpClient: HttpClient) {
    this.refreshListTask = new BehaviorSubject(false);
  }

  getRefreshListTask(): Observable<boolean> {
    return this.refreshListTask;
  }

  setRefreshListTask(refresh: boolean) {
    this.refreshListTask.next(refresh);
  }

  private getUrl(uri: string): string {
    return '/api/tasks' + uri;
  }

  /**
   * Get task by is ID
   * @param id task id
   * @returns the task
   */
  getTaskById(id: number): Observable<TaskDto> {
    return this.httpClient.get<TaskDto>(this.getUrl(`/${id}`));
  }

  /**
   * Get all tasks
   * @param page page number to get
   * @param size page size to get
   * @param complete status filter of task
   * @returns the task
   */
  getAllTasks(page: number, size: number, complete: boolean): Observable<ListTasks<TaskDto>> {
    return this.httpClient.get<ListTasks<TaskDto>>(this.getUrl(`?page=` + page + `&size=` + size + `&toComplete=` + complete));
  }

  /**
   * update Task
   *@param row dto task
   */
  updateTask(row: TaskDto): Observable<any> {
    const body = {id: row.id, label: row.label, complete: !row.complete};
    return this.httpClient.put(this.getUrl(`/${row.id}`), body);
  }

  /**
   * create Task
   *@param newTask dto task with form value
   */
  createTask(newTask: TaskDto): Observable<any> {
    const body = {label: newTask.label, complete: newTask.complete};
    return this.httpClient.post(this.getUrl(""), body);
  }

}

export class TaskDto {
  id?: number;
  label!: string;
  complete!: boolean;
}

export class ListTasks<T> {
  content!: T[];
  totalElements?: number;
  pageIndex?: number;
}
