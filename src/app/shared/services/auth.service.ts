import { EventEmitter, Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../user.model';
import { PromocodeService } from './promocode.service';
import { ToastsManager } from 'ng2-toastr';
import { baseUrl, setOptions } from '../helper';


// Avoid name not found warnings
declare const Auth0Lock: any;

@Injectable()
export class Auth {
  // Configure Auth0
  public lock = new Auth0Lock('hfDx6WXS2nkcLUhOcHe0Xq34lZE3wfrH', 'myteam-shop.eu.auth0.com', {});
  public onAuth: EventEmitter<User> = new EventEmitter();

  private user: User;
  private downloadingProfile: boolean;

  constructor(private router: Router,
              private http: Http,
              private promocodeService: PromocodeService,
              private toastr: ToastsManager) {
    // Set userProfile attribute of already saved profile
    try {
      if (localStorage.getItem('id_token')) {
        this.getProfile();
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
          this.onAuth.emit(null);
          return;
        }
        this.saveProfile(currentUser);
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
    this.user = null;
    this.onAuth.emit(this.user);
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

    this.getProfile(user);
  }

  public updateProfile(field, value) {
    this.user[field] = value;
    return this.http.put(`${baseUrl}api/profile/${this.user.id}`, {field, value}, setOptions())
      .map((res) => {
        this.onAuth.emit(this.user);
        return res.json();
      });
  }

  public getProfile(user?) {
    if (!localStorage.getItem('id_token') || this.downloadingProfile) {
      this.onAuth.emit(null);
      return;
    }
    if (this.user && !this.downloadingProfile) {
      this.onAuth.emit(this.user);
      return;
    }
    this.downloadingProfile = true;
    this.http.post(`${baseUrl}api/profile`, user, setOptions())
      .map((response) => response.json())
      .map((data) => {
        if (data.statusCode === 201) {
          this.user = new User(data.body);
          this.promocodeService.create(this.user.id, true)
            .subscribe((response) => {
              this.toastr.info(`You have a promocode with ${response.persent}% discount!`,
                `New promocode in your profile!`);
            });
        } else {
          this.user = new User(data);
        }
        this.downloadingProfile = false;
        return this.user;
      })
      .subscribe(
        (data) => this.onAuth.emit(this.user),
        (error) => this.onAuth.emit(null)
      );
  }

  public createOrder(orderData) {
    return this.http.post(`${baseUrl}api/admin/createOrder`, orderData, setOptions())
      .map((res) => res.json());
  }

  public getOrdersByProfile(id) {
    const options: RequestOptions = setOptions();
    options.params = new URLSearchParams();
    options.params.set('id', id);
    return this.http.get(`${baseUrl}api/admin/getOrdersByProfile`, options)
      .map((res) => res.json());
  }

  public getOrderById(id) {
    const options: RequestOptions = setOptions();
    options.params = new URLSearchParams();
    options.params.set('id', id);
    return this.http.get(`${baseUrl}api/admin/getOrderById`, options)
      .map((res) => res.json());
  }

  public getOrderCount() {
    return this.user.orders.length;
  }
}
