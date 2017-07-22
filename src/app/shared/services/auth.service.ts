// app/auth.service.ts

import { EventEmitter, Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../user.model';
import { PromocodeService } from './promocode.service';
import { ToastsManager } from 'ng2-toastr';


// Avoid name not found warnings
declare const Auth0Lock: any;
const PRIVATE_ENDPOINT = 'https://7m3etwllfd.execute-api.eu-central-1.amazonaws.com/dev/api/profile';

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock('hfDx6WXS2nkcLUhOcHe0Xq34lZE3wfrH', 'myteam-shop.eu.auth0.com', {});
  user: User;
  onAuth = new EventEmitter();

  constructor(private router: Router,
              private http: Http,
              private promocodeService: PromocodeService,
              private toastr: ToastsManager) {
    // Set userProfile attribute of already saved profile
    try {
      if (localStorage.getItem('id_token')) {
        this.getProfile()
          .subscribe((data) => {
            this.user = new User(data);
            this.onAuth.emit(true);
          });
      }
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
    let user: User;
    if (currentUser.identities[0].provider === 'vkontakte') {
      user = new User(
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
      user = new User(
        {
          nickName: currentUser.nickname,
          picture: currentUser.picture,
          currentUser: currentUser.identities[0].provider,
          email: currentUser.email[0].email,
          firstName: currentUser.name.split(' ')[0],
          lastName: currentUser.name.split(' ')[1],
        }
      );
    }
    this.createProfile(user)
      .subscribe((res) => {
        if (res.statusCode === 201) {
          this.user = user;
          this.promocodeService.create(true)
            .subscribe((response) => {
              this.toastr.info(`You have a promocode with ${response.persent}% discount!`,
                `New promocode in your profile!`);
            });
        } else {
          this.getProfile()
            .subscribe((data) => this.user = new User(data));
        }
      });
  }

  public createProfile(user: User) {
    return this.http.post(`${PRIVATE_ENDPOINT}/create`, user, this.getOptions())
      .map((res) => res.json());
  }

  public updateProfile(field, value) {
    return this.http.post(`${PRIVATE_ENDPOINT}/update`, {field, value}, this.getOptions())
      .map((res) => res.json());
  }

  public getProfile() {
    return this.http.get(`${PRIVATE_ENDPOINT}/get`, this.getOptions())
      .map((res: any) => res.json());
  }

  public getOrderCount() {
    return this.user.orders.length;
  }

  private getOptions() {
    const token = localStorage.getItem('id_token');
    if (!token) {
      return;
    }
    const myHeaders = new Headers();
    myHeaders.set('Authorization', `Bearer ${token}`);
    return new RequestOptions({
      headers: myHeaders
    });
  }

}
