import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISupplierDto } from '../../../models/supplier/supplier.dto';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.backendUrl}/supplier`; // Adjust as needed

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<ISupplierDto[]> {
    return this.http.get<ISupplierDto[]>(this.apiUrl);
  }

  getSupplier(id: number): Observable<ISupplierDto> {
    return this.http.get<ISupplierDto>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: ISupplierDto): Observable<ISupplierDto> {
    return this.http.post<ISupplierDto>(this.apiUrl, supplier);
  }

  updateSupplier(id: number, supplier: ISupplierDto): Observable<ISupplierDto> {
    return this.http.put<ISupplierDto>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}