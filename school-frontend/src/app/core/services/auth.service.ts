import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokenService = inject(TokenService);

  // Signals for state tracking
  currentUser = signal<any | null>(null);
  currentProfile = signal<any | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadSession();
  }

  private loadSession(): void {
    const token = this.tokenService.getToken();
    const user = this.tokenService.getUser();
    if (token && user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      // We can lazily load detailed profile later
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.api.post<any>('/auth/login', credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.tokenService.saveToken(response.token);
          this.tokenService.saveUser(response.user);
          this.currentUser.set(response.user);
          this.currentProfile.set(response.profile);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUser.set(null);
    this.currentProfile.set(null);
    this.isAuthenticated.set(false);
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return roles.includes(user.role);
  }

  getRole(): string | null {
    const user = this.currentUser();
    return user ? user.role : null;
  }

  getProfileId(): number | null {
    // Decode JWT token payload or use loaded session profile
    const token = this.tokenService.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.profileId || null;
    } catch {
      return null;
    }
  }

  updateProfile(profileData: any): Observable<any> {
    return this.api.put<any>('/auth/profile', profileData).pipe(
      tap(res => {
        if (res && res.user) {
          this.tokenService.saveUser(res.user);
          this.currentUser.set(res.user);
          this.currentProfile.set(res.profile);
        }
      })
    );
  }

  changePassword(passwordData: any): Observable<any> {
    return this.api.put<any>('/auth/change-password', passwordData);
  }
}
