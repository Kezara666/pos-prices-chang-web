import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProductWithDependenciesDto, Product } from './product.model';
import { environment } from '../../../environments/environment.prod';
import { LoginService } from '../../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.backendUrl}/products`; // Adjust as per your backend

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/shop/${this.loginService.shopId}`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProductWithDependencies(payload: CreateProductWithDependenciesDto): Observable<any> {
    // Assuming your backend endpoint is something like /products/create-full
    return this.http.post<any>(`${this.baseUrl}/create-full`, payload);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    console.log(`Updating product with ID: ${id}`, product);
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  setProductCurrentPrice(productId: number, productPriceId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${productId}/set-current-price`, {
      productPriceId,
    });
  }
}