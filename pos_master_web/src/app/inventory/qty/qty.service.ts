import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { CreateQtyDto } from '../../../models/create-qty.dto';

@Injectable({
  providedIn: 'root'
})
export class QtyService {
  private apiUrl = `${environment.backendUrl}/qtys`; // Adjust base URL as needed

  constructor(private http: HttpClient) {}

  // You can add methods to interact with your backend API here
  // For example:

  // Create a new quantity entry
  createQuantity(data: CreateQtyDto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Get all quantities
  getAllQuantities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a specific quantity by ID
  getQuantityById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update an existing quantity
  updateQuantity(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Delete a quantity
  deleteQuantity(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  updateQtyReduce(productId: number, amount: number) {
  return this.http.patch(`${environment.backendUrl}/qtys/${productId}/decrease/${amount}`, {});
}
}