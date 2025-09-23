import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment.prod";
import { IUser } from "../../models/user/create-user.dto";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = `${environment.backendUrl}/users/login`; // Matches provided endpoint
  public loggedUser = signal<IUser | null>(null); // Signal to store IUser or null

  constructor(private http: HttpClient) {
    // Initialize loggedUser from localStorage on service creation
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.loggedUser.set(JSON.parse(storedUser) as IUser);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
      }
    }
  }

  // Login method that updates loggedUser signal and localStorage
  login(userName: string, password: string): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, { userName, password }).pipe(
      tap((user: IUser) => {
        this.loggedUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  // Set user manually (e.g., after token refresh)
  setUser(user: IUser): void {
    this.loggedUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear user (logout)
  setFalse(): void {
    this.loggedUser.set(null);
    localStorage.removeItem('user');
  }

  // Get the current logged-in user (read-only signal)
  get currentUser() {
    return this.loggedUser;
  }

  // Check if a user is logged in
  get isAuthenticated(): boolean {
    return localStorage.getItem("user") !== null;
  }

  // Get the current user's ID, if logged in
  get userId(): number {
    return this.loggedUser()?.id ?? 0;
  }

  // Get the current user's shop ID, if logged in
  get shopId(): number {
    return this.loggedUser()?.shopId ?? 0; // Assumes shop: { id: number; name: string }
    // Alternative: return this.loggedUser()?.shopId ?? null; // If shopId is directly in IUser
  }

  // Clear user (logout)
  logout(): void {
    this.loggedUser.set(null);
    localStorage.removeItem('user');
  }
}