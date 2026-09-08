import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'sms_auth_token';
  private readonly USER_KEY = 'sms_auth_user';

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  saveUser(user: any): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): any | null {
    if (typeof window !== 'undefined') {
      const u = window.localStorage.getItem(this.USER_KEY);
      return u ? JSON.parse(u) : null;
    }
    return null;
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.TOKEN_KEY);
      window.localStorage.removeItem(this.USER_KEY);
    }
  }
}
