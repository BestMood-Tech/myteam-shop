// app/auth.service.ts

import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from "../user.model";


// Avoid name not found warnings
declare let Auth0Lock: any;

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock('hfDx6WXS2nkcLUhOcHe0Xq34lZE3wfrH', 'myteam-shop.eu.auth0.com', {});
  user: User;

  constructor() {
    // Set userProfile attribute of already saved profile
    try {
        if(JSON.parse(localStorage.getItem('profile')))
          this.saveProfile(JSON.parse(localStorage.getItem('profile')));
    }
    catch (e) {
      console.log(e);
    }


    // Add callback for the Lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          console.log(error);
          return;
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        this.saveProfile(profile);
      });
    });
  }


  public login() {
    // Call the show method to display the widget.
    this.lock.show((err, profile, id_token) => {
      localStorage.setItem('profile', JSON.stringify(profile));
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
    localStorage.removeItem('profile');
    this.user = undefined;
  };

  private saveProfile(profile) {

    if (window.localStorage.getItem(profile.nickname)) {

      try {
        let userLS = JSON.parse(window.localStorage.getItem(profile.nickname));

        this.user = this.ObjectInArray(userLS);
        return;
      }
      catch (e) {
        console.log(e);
      }

    }

    if (profile.identities[0].provider == 'vkontakte') {
      this.user = new User(
        [
          profile.nickname,
          profile.picture,
          profile.identities[0].provider,
          "",
          profile.given_name,
          profile.family_name,
          "",
          [],
          []
        ]
      );
      localStorage.setItem(this.user.nickname, JSON.stringify(this.user));
      return;
    }

    if (profile.identities[0].provider == 'github') {
      this.user = new User(
        [
          profile.nickname,
          profile.picture,
          profile.identities[0].provider,
          profile.email[0].email,
          "",
          "",
          "",
          [],
          []
        ]
      );
      this.user.updateLSUser(this.user.nickname,this.user.toJson());
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
