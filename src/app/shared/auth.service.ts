// app/auth.service.ts

import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import {User} from "./user.model";

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock('hfDx6WXS2nkcLUhOcHe0Xq34lZE3wfrH', 'myteam-shop.eu.auth0.com', {});
  userProfile: Object;
  user: User;

  constructor() {
    //window.localStorage.clear();
    // Set userProfile attribute of already saved profile
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    if(this.userProfile) this.saveProfile(this.userProfile);

    // Add callback for the Lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
        this.saveProfile(profile);
      });
    });
  }

  get UserProfile() { return this.userProfile}
  get User() { return this.user }
  get UserAdress() {return this.user.Address}


  public login() {
    // Call the show method to display the widget.
    this.lock.show((err, profile, id_token) => {
      this.userProfile = profile;
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
    this.userProfile = undefined;
    this.user = undefined;
  };

  public updateUserPersonal(nickname:string, firstname:string, lastname:string, email:string[], phone:string) {
    let personal = JSON.parse(window.localStorage.getItem(nickname));

    if(!personal) return;

    personal.firsname = firstname;
    personal.lastname = lastname;
    personal.email = email;
    personal.phone = phone;

    window.localStorage.removeItem(nickname);
    window.localStorage.setItem(nickname,JSON.stringify(personal));

    this.user = personal;
  }

  public updateUserAddress(nickname:string, address:string[]) {
    let personal = JSON.parse(window.localStorage.getItem(nickname));

    if(!personal) return;

    personal.address = address;

    window.localStorage.removeItem(nickname);
    window.localStorage.setItem(nickname,JSON.stringify(personal));

    this.user = personal;
  }

  private saveProfile(profile) {

    if(window.localStorage.getItem(profile.nickname)) {
      this.user = JSON.parse(window.localStorage.getItem(profile.nickname));
      return;
    }

    if(profile.identities[0].provider == 'vkontakte') {
      this.user = new User(
        [
          profile.nickname,
          profile.picture,
          profile.identities[0].provider,
          [],
          profile.given_name,
          profile.family_name,
          "",
          [],
          []
        ]
      );
      localStorage.setItem(this.user.nickname,JSON.stringify(this.user));
      return;
    }

    if(profile.identities[0].provider == 'github') {
      this.user = new User(
        [
          profile.nickname,
          profile.picture,
          profile.identities[0].provider,
          profile.emails,
          "",
          "",
          "",
          [],
          []
        ]
      );
      localStorage.setItem(this.user.nickname,JSON.stringify(this.user));
      return;
    }

  }

}
