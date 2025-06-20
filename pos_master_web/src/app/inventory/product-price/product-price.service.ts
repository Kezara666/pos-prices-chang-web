import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductPrice } from '../../../models/product-price/product-price.model';
import { environment } from '../../../environments/environment.prod';
import { CreateProductPriceDto } from '../../../models/create-product-price.dto';
import { LoginService } from '../../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ProductPriceService {
  private apiUrl = `${environment.backendUrl}/product-prices`; // Adjust base URL as needed

  constructor(private http: HttpClient,private loginService:LoginService) {}

  getAll(): Observable<ProductPrice[]> {
    return this.http.get<ProductPrice[]>(`${this.apiUrl}/shop/${this.loginService.shopId}`);
  }

  getById(id: number): Observable<ProductPrice> {
    return this.http.get<ProductPrice>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateProductPriceDto): Observable<ProductPrice> {
    return this.http.post<ProductPrice>(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<ProductPrice> {
    return this.http.patch<ProductPrice>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}