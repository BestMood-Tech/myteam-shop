import { EventEmitter, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { tokenNotExpired } from 'angular2-jwt';
import { ToastsManager } from 'ng2-toastr';

import { Profile } from '../models/profile.model';
import { PromocodeService } from './promocode.service';
import { baseUrl, setOptions } from '../helper';
import { Address } from '../models/address.model';
import { Observable } from 'rxjs/Observable';

// Avoid name not found warnings
declare const Auth0Lock: any;

@Injectable()
export class AuthService {
  // Configure Auth0
  public lock = new Auth0Lock('hfDx6WXS2nkcLUhOcHe0Xq34lZE3wfrH', 'myteam-shop.eu.auth0.com', {});
  public profile: EventEmitter<Profile> = new EventEmitter();

  private profileData: Profile;
  private isLoading: boolean;

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
          this.profile.emit(null);
          return;
        }
        this.saveProfile(currentUser);
      });
    });
  }

  public login(): void {
    // Call the show method to display the widget.
    this.lock.show((err, currentUser, id_token) => {
      localStorage.setItem('id_token', id_token);
    });
  };

  public get isAuthenticated(): boolean {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired('id_token');
  };


  public logout(): void {
    // Remove token and profile from localStorage
    localStorage.removeItem('id_token');
    this.profileData = null;
    this.profile.emit(this.profileData);
    this.router.navigate(['./home']);
  };

  private saveProfile(currentUser: any): void {
    let user: Profile;
    if (currentUser.identities[0].provider === 'vkontakte') {
      user = new Profile({
        nickName: currentUser.nickname,
        picture: currentUser.picture,
        firstName: currentUser.given_name,
        lastName: currentUser.family_name,
      });
    } else {
      user = new Profile({
        nickName: currentUser.nickname,
        picture: currentUser.picture,
        email: currentUser.email[0].email,
        firstName: currentUser.name.split(' ')[0],
        lastName: currentUser.name.split(' ')[1],
      });
    }

    this.getProfile(user);
  }

  public updateProfile(field: string, value: string | Address[]): Observable<any> {
    this.profileData[field] = value;
    return this.http.put(`${baseUrl}api/profile/${this.profileData.id}`, { field, value }, setOptions())
      .map((response) => {
        this.profile.emit(this.profileData);
        return response.json();
      });
  }

  public getProfile(user?: Profile): void {
    if (!localStorage.getItem('id_token') || this.isLoading) {
      this.profile.emit(null);
      return;
    }
    if (this.profileData && !this.isLoading) {
      this.profile.emit(this.profileData);
      return;
    }
    this.isLoading = true;
    this.http.post(`${baseUrl}api/profile`, user, setOptions())
      .map((response) => response.json())
      .map((data) => {
        this.profileData = new Profile(data.body);
        if (data.statusCode === 201) {
          this.promocodeService.create(this.profileData.id, true)
            .subscribe((response) => {
              this.toastr.info(`You have a promocode with ${response.percent}% discount!`,
                `New promocode in your profile!`);
            });
        }
        this.isLoading = false;
        return this.profileData;
      })
      .subscribe(
        (data) => this.profile.emit(this.profileData),
        (error) => this.profile.emit(null)
      );
  }
}
