// app/auth.service.ts

import { EventEmitter, Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../user.model';


// Avoid name not found warnings
declare const Auth0Lock: any;
const PRIVATE_ENDPOINT = 'https://ptha6fpjy9.execute-api.eu-central-1.amazonaws.com/dev/api/profile';

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock('hfDx6WXS2nkcLUhOcHe0Xq34lZE3wfrH', 'myteam-shop.eu.auth0.com', {});
  user: User;
  onAuth = new EventEmitter();

  constructor(private router: Router,
              private http: Http) {
    // Set userProfile attribute of already saved profile
    try {
      if (localStorage.getItem('id_token')) {
        // this.saveProfile(JSON.parse(localStorage.getItem('currentUser')));
        this.getProfile()
          .subscribe((data) => {
            if (data.message) {
              return;
            }
            this.user = new User(data);
            console.log('auth user=', this.user);
            this.onAuth.emit(true);
          });
      }
    } catch (e) {
      console.log(e);
    }


    // Add callback for the Lock `authenticated` event
    this.lock.on('authenticated', (authResult) => {
      console.log('auth');
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, currentUser) => {
        if (error) {
          // Handle error
          console.log(error);
          this.onAuth.emit(false);
          return;
        }
        this.saveProfile(currentUser);
        this.onAuth.emit(true);
      });
    });
  }


  public login() {
    // Call the show method to display the widget.
    this.lock.show((err, currentUser, id_token) => {
      localStorage.setItem('id_token', id_token);
    });
  };

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired('id_token');
  };


  public logout() {
    // Remove token and profile from localStorage
    localStorage.removeItem('id_token');
    this.user = undefined;
    this.onAuth.emit(false);
    this.router.navigate(['./home']);
  };

  private saveProfile(currentUser) {
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
    }
    this.createProfile(this.user)
      .subscribe((res) => {
        if (res.statusCode === 201) {
          console.log('created user');
        } else {
          this.getProfile()
            .subscribe((data) => this.user = new User(data));
        }
      });
  }

  public createProfile(user: User) {
    const token = localStorage.getItem('id_token');
    if (!token) {
      return;
    }
    const myHeaders = new Headers();
    myHeaders.set('Authorization', `Bearer ${token}`);
    const options = new RequestOptions({
      headers: myHeaders
    });
    return this.http.post(`${PRIVATE_ENDPOINT}/create`, user, options)
      .map((res) => res.json());
  }

  public updateProfile(field, value) {
    const token = localStorage.getItem('id_token');
    if (!token) {
      return;
    }
    this.user.updateProfile(field, value);
    const myHeaders = new Headers();
    myHeaders.set('Authorization', `Bearer ${token}`);
    const options = new RequestOptions({
      headers: myHeaders
    });
    return this.http.post(`${PRIVATE_ENDPOINT}/update`, {field, value}, options)
      .map((res) => res.json());
  }

  public getProfile() {
    const token = localStorage.getItem('id_token');
    if (!token) {
      return;
    }
    const myHeaders = new Headers();
    myHeaders.set('Authorization', `Bearer ${token}`);
    const options = new RequestOptions({
      headers: myHeaders
    });
    return this.http.get(`${PRIVATE_ENDPOINT}/get`, options)
      .map((res: any) => {
        res = res.json();
        return res.body;
      });
  }

}
