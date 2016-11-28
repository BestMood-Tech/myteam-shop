// app/auth.service.ts

import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from "../user.model";
import { CanActivate, Router } from '@angular/router';


// Avoid name not found warnings
declare let Auth0Lock: any;

@Injectable()
export class Auth implements CanActivate{
  // Configure Auth0
  lock = new Auth0Lock('hfDx6WXS2nkcLUhOcHe0Xq34lZE3wfrH', 'myteam-shop.eu.auth0.com', {});
  user: User;

  constructor(private router: Router) {
    // Set userProfile attribute of already saved profile
    try {
      if(JSON.parse(localStorage.getItem('currentUser')))
        this.saveProfile(JSON.parse(localStorage.getItem('currentUser')));
    }
    catch (e) {
      console.log(e);
    }


    // Add callback for the Lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, currentUser) => {
        if (error) {
          // Handle error
          console.log(error);
          return;
        }

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.saveProfile(currentUser);
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

  canActivate() {
    return !!tokenNotExpired();
  };


  public logout() {
    // Remove token and profile from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('currentUser');
    this.user = undefined;

    this.router.navigate(['./home']);
  };

  private saveProfile(currentUser) {

    if (window.localStorage.getItem(currentUser.nickname)) {

      try {
        let userLS = JSON.parse(window.localStorage.getItem(currentUser.nickname));

        this.user = this.ObjectInArray(userLS);
        return;
      }
      catch (e) {
        console.log(e);
      }

    }

    if (currentUser.identities[0].provider == 'vkontakte') {
      this.user = new User(
        [
          currentUser.nickname,
          currentUser.picture,
          currentUser.identities[0].provider,
          "",
          currentUser.given_name,
          currentUser.family_name,
          "",
          [],
          []
        ]
      );
      return;
    }

    if (currentUser.identities[0].provider == 'github') {
      this.user = new User(
        [
          currentUser.nickname,
          currentUser.picture,
          currentUser.identities[0].provider,
          currentUser.email[0].email,
          "",
          "",
          "",
          [],
          []
        ]
      );
      return;
    }
  }

  private ObjectInArray(userLS) {
    let buffer = [];

    for (let key of Object.keys(userLS)) {
      buffer.push(userLS[key]);
    }

    return new User(buffer);
  }

}
