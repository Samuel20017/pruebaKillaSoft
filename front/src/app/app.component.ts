import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { TaskService } from "./services/task.service";
import { Task, TaskCreate, TaskUpdate } from "./models/task.model";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Task Manager";
  tasks: Task[] = [];
  taskForm: FormGroup;
  editForm: FormGroup;
  errorMessage = "";
  successMessage = "";
  isEditing = false;
  editingTaskId: number | null = null;
  isCreateOpen = false;
  isSubmittingCreate = false;
  isSubmittingEdit = false;
  createErrorMsg = "";
  editErrorMsg = "";

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(1)]],
      description: [""],
    });

    this.editForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(1)]],
      description: [""],
      completed: [false],
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.clearMessages();
      },
      error: (error) => {
        this.showError("Error al cargar las tareas: " + error.message);
      },
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isSubmittingCreate = true;
      this.createErrorMsg = "";
      const newTask: TaskCreate = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description || null,
        completed: false,
      };

      this.taskService.createTask(newTask).subscribe({
        next: (task) => {
          this.tasks.unshift(task);
          this.taskForm.reset();
          this.isCreateOpen = false;
          this.showSuccess("Tarea creada exitosamente");
          this.isSubmittingCreate = false;
        },
        error: (error) => {
          this.createErrorMsg = error.message || "No se pudo crear la tarea";
          this.showError("Error al crear la tarea: " + this.createErrorMsg);
          this.isSubmittingCreate = false;
          this.taskForm.markAllAsTouched();
        },
      });
    }
  }

  openCreate(): void {
    this.isCreateOpen = true;
  }

  closeCreate(): void {
    this.isCreateOpen = false;
    this.taskForm.reset();
  }

  toggleComplete(task: Task): void {
    const update: TaskUpdate = {
      completed: !task.completed,
    };

    this.taskService.updateTask(task.id, update).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.showSuccess("Estado de tarea actualizado");
      },
      error: (error) => {
        this.showError("Error al actualizar la tarea: " + error.message);
      },
    });
  }

  startEdit(task: Task): void {
    this.isEditing = true;
    this.editingTaskId = task.id;
    this.editErrorMsg = "";
    this.editForm.patchValue({
      title: task.title,
      description: task.description || "",
      completed: task.completed,
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingTaskId = null;
    this.editForm.reset();
  }

  saveEdit(): void {
    if (this.editForm.valid && this.editingTaskId !== null) {
      this.isSubmittingEdit = true;
      this.editErrorMsg = "";
      const update: TaskUpdate = {
        title: this.editForm.value.title,
        description: this.editForm.value.description || null,
        completed: this.editForm.value.completed,
      };

      this.taskService.updateTask(this.editingTaskId, update).subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex(
            (t) => t.id === this.editingTaskId
          );
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.cancelEdit();
          this.showSuccess("Tarea actualizada exitosamente");
          this.isSubmittingEdit = false;
        },
        error: (error) => {
          this.editErrorMsg = error.message || "No se pudo actualizar la tarea";
          this.showError("Error al actualizar la tarea: " + this.editErrorMsg);
          this.isSubmittingEdit = false;
          this.editForm.markAllAsTouched();
        },
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm("¿Estás seguro de eliminar esta tarea?")) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((t) => t.id !== id);
          this.showSuccess("Tarea eliminada exitosamente");
        },
        error: (error) => {
          this.showError("Error al eliminar la tarea: " + error.message);
        },
      });
    }
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = "";
    setTimeout(() => (this.errorMessage = ""), 5000);
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = "";
    setTimeout(() => (this.successMessage = ""), 3000);
  }

  private clearMessages(): void {
    this.errorMessage = "";
    this.successMessage = "";
  }
}
