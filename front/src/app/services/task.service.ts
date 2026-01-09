import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";
import { Task, TaskCreate, TaskUpdate } from "../models/task.model";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = "http://localhost:8000/api/tasks";

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/`).pipe(
      timeout(10000),
      catchError((error) => this.handleError(error))
    );
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}/`).pipe(
      timeout(10000),
      catchError((error) => this.handleError(error))
    );
  }

  createTask(task: TaskCreate): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/`, task).pipe(
      timeout(10000),
      catchError((error) => this.handleError(error))
    );
  }

  updateTask(id: number, task: TaskUpdate): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/`, task).pipe(
      timeout(10000),
      catchError((error) => this.handleError(error))
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      timeout(10000),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message = this.buildUserMessage(error);
    console.error("HTTP error", { status: error.status, error });
    return throwError(() => new Error(message));
  }

  private buildUserMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return "No se pudo conectar con el servidor.";
    }


    const detail = this.extractDetail(error.error);

    switch (error.status) {
      case 400:
        return detail || "Solicitud inválida. Revisa los datos ingresados.";
      case 401:
        return "No autorizado. Inicia sesión para continuar.";
      case 403:
        return "No tienes permisos para realizar esta acción.";
      case 404:
        return (
          detail || "Recurso no encontrado. Puede que haya sido eliminado."
        );
      case 409:
        return detail || "Conflicto con el estado actual del recurso.";
      case 422:
        return (
          detail ||
          "Datos inválidos. Corrige los campos marcados e inténtalo de nuevo."
        );
      default:
        if (error.status >= 500) {
          return "Ocurrió un problema en el servidor. Intenta nuevamente en unos instantes.";
        }
        return detail || "Ocurrió un error inesperado. Intenta nuevamente.";
    }
  }

  private extractDetail(payload: any): string | null {
    if (!payload) return null;

    if (typeof payload === "string") {
      try {
        const parsed = JSON.parse(payload);
        return this.extractDetail(parsed);
      } catch {
        return payload;
      }
    }
    if (typeof payload === "object" && "detail" in payload) {
      const d = (payload as any).detail;
      if (Array.isArray(d)) {

        const msgs = d
          .map((e: any) => e?.msg)
          .filter((m: any) => !!m)
          .join(". ");
        return msgs || null;
      }
      if (typeof d === "string") return d;
      if (d && typeof d === "object" && "msg" in d) return d.msg as string;
    }

    if (typeof payload === "object" && "message" in payload) {
      return (payload as any).message as string;
    }
    return null;
  }
}
