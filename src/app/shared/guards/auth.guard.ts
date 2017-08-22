import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {
  }

  public canActivate() {
    return this.auth.isAuthenticated;
  }
}
