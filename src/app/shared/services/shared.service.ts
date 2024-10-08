import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService<T> {
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  openForm(row: T | null, formComponent: any): Observable<any> {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row,
    };
    const reference: MatDialogRef<any> = this.dialog.open(
      formComponent,
      options
    );

    return reference.afterClosed();
  }

  showMessage(message: string, duration: number = 5000) {
    this.snackBar.open(message, '', { duration });
  }

  loadData(
    serviceMethod: () => Observable<T[]>,
    component: {
      records: T[];
      totalRecords: number;
      changePage: (page: number) => void;
    }
  ): void {
    serviceMethod().subscribe({
      next: (data: T[]) => {
        component.records = data;
        component.totalRecords = data.length;
        component.changePage(0);
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error al cargar los datos');
      },
    });
  }

  delete(
    id: number,
    serviceDeleteMethod: (id: number) => Observable<T>,
    loadMethod: () => void
  ): void {
    serviceDeleteMethod(id).subscribe({
      next: () => {
        loadMethod();
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error al eliminar el registro');
      },
    });
  }
}
