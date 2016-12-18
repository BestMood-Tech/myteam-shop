// app/auth.service.ts

import { Injectable, EventEmitter } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../user.model';
import { Router } from '@angular/router';


// Avoid name not found warnings
declare let Auth0Lock: any;

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock('hfDx6WXS2nkcLUhOcHe0Xq34lZE3wfrH', 'myteam-shop.eu.auth0.com', {});
  user: User;
  onAuth = new EventEmitter();

  constructor(private router: Router) {
    // Set userProfile attribute of already saved profile
    try {
      if (JSON.parse(localStorage.getItem('currentUser')))
        this.saveProfile(JSON.parse(localStorage.getItem('currentUser')));
      this.onAuth.emit(true);
    } catch (e) {
      console.log(e);
    }


    // Add callback for the Lock `authenticated` event
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, currentUser) => {
        if (error) {
          // Handle error
          console.log(error);
          this.onAuth.emit(false);
          return;
        }

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.saveProfile(currentUser);
        this.onAuth.emit(true);
      });
    });
  }


  public login() {
    // Call the show method to display the widget.
    this.lock.show((err, currentUser, id_token) => {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('id_token', id_token);
    });
  };

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };


  public logout() {
    // Remove token and profile from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('currentUser');
    this.user = undefined;
    this.onAuth.emit(false);
    this.router.navigate(['./home']);
  };

  private saveProfile(currentUser) {

    if (window.localStorage.getItem(currentUser.nickname)) {

      try {
        let userLS = JSON.parse(window.localStorage.getItem(currentUser.nickname));

        this.user = new User(userLS);
        return;
      } catch (e) {
        console.log(e);
      }

    }

    if (currentUser.identities[0].provider === 'vkontakte') {
      this.user = new User(
        {
          nickName: currentUser.nickname,
          picture: currentUser.picture,
          currentUser: currentUser.identities[0].provider,
          firstName: currentUser.given_name,
          lastName: currentUser.family_name,
        }
      );
      return;
    }

    if (currentUser.identities[0].provider === 'github') {
      this.user = new User(
        {
          nickName: currentUser.nickname,
          picture: currentUser.picture,
          currentUser: currentUser.identities[0].provider,
          email: currentUser.email[0].email
        }
      );
      return;
    }
  }

}
