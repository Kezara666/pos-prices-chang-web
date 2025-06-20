import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QtyType } from '../../../models/qty-type/qty-type';
import { environment } from '../../../environments/environment.prod';
import { LoginService } from '../../login/login.service';


@Injectable({
  providedIn: 'root'
})
export class QtyTypesService {
  private apiUrl = `${environment.backendUrl}/qty-types`; // Adjust this URL to match your backend endpoint

  constructor(private http: HttpClient,private loginService:LoginService) { }

  getQtyTypes(): Observable<QtyType[]> {
    return this.http.get<QtyType[]>(`${this.apiUrl}/shop/${this.loginService.shopId}`);
  }


  getQtyTypeById(id: number): Observable<QtyType> {
    return this.http.get<QtyType>(`${this.apiUrl}/${id}`);
  }

  createQtyType(qtyType: QtyType): Observable<QtyType> {
    return this.http.post<QtyType>(this.apiUrl, qtyType);
  }

  updateQtyType(id: number, qtyType: QtyType): Observable<QtyType> {
    return this.http.patch<QtyType>(`${this.apiUrl}/${id}`, qtyType);
  }

  deleteQtyType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
