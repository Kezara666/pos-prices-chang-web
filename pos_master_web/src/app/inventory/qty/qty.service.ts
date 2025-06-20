import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.prod';
import { Qty } from '../../../models/qty/qty.dto';
import { CreateQtyDto } from '../../../models/create-qty.dto';
import { LoginService } from '../../login/login.service';
@Injectable({
  providedIn: 'root'
})
export class QtyService {
  private apiUrl = `${environment.backendUrl}/qties`;

  constructor(private http: HttpClient , private loginService: LoginService) {}

  getAllQuantities(): Observable<Qty[]> {
    return this.http.get<Qty[]>(`${this.apiUrl}/shop/${this.loginService.shopId}`);
  }

  getQuantity(id: number): Observable<Qty> {
    return this.http.get<Qty>(`${this.apiUrl}/${id}`);
  }

  createQuantity(dto: CreateQtyDto): Observable<Qty> {
    const payload = {
      ...dto,
      shopId: this.loginService.shopId, // Or fetch dynamically
      createdById: this.loginService.userId, // From auth/session
      updatedById: this.loginService.userId
    };
    return this.http.post<Qty>(this.apiUrl, payload);
  }

  updateQuantity(id: number, dto: Partial<CreateQtyDto>): Observable<Qty> {
    const payload = {
      ...dto,
      updatedById: this.loginService.userId // From auth/session
    };
    return this.http.patch<Qty>(`${this.apiUrl}/${id}`, payload);
  }

  deleteQuantity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}