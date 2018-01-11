import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { tokenNotExpired } from 'angular2-jwt';
import { ToastsManager } from 'ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { baseUrl, setOptions } from '../helper';
import { Address, Profile } from '../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as PromocodeActions from '../../store/promocode/promocode.action';
import { getPromocodePercent } from '../../store/promocode/promocode.state';
import { Percent } from './promocode.service';

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
              private httpClient: HttpClient,
              private store: Store<AppState>,
              private toastsManager: ToastsManager) {
    // Set userProfile attribute of already saved profile
    try {
      if (localStorage.getItem('id_token')) {
        this.get();
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
        this.save(currentUser);
      });
    });
    this.store.select(getPromocodePercent).subscribe((percent: Percent) => {
      if (percent) {
        this.toastsManager.info(`You have a promocode with ${percent.percent}% discount!`,
          `New promocode in your profile!`);
      }
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

  private save(currentUser: any): void {
    let user: Profile;
    if (currentUser.identities[0].provider === 'vkontakte') {
      user = new Profile({
        nickName: currentUser.nickname,
        picture: currentUser.picture,
        firstName: currentUser.given_name,
        lastName: currentUser.family_name,
        currency: '$'
      });
    } else {
      user = new Profile({
        nickName: currentUser.nickname,
        picture: currentUser.picture,
        email: currentUser.email[0].email,
        firstName: currentUser.name.split(' ')[0],
        lastName: currentUser.name.split(' ')[1],
        currency: '$'
      });
    }

    this.get(user);
  }

  public update(field: string, value: string | Address[]): Observable<any> {
    this.profileData[field] = value;
    return this.httpClient.put(`${baseUrl}api/profile/${this.profileData.id}`, { field, value }, setOptions())
      .map((result) => {
        this.profile.emit(this.profileData);
        return result;
      });
  }

  public get(user?: Profile): void {
    if (!localStorage.getItem('id_token') || this.isLoading) {
      this.profile.emit(null);
      return;
    }
    if (this.profileData && !this.isLoading) {
      this.profile.emit(this.profileData);
      return;
    }
    this.isLoading = true;
    this.httpClient.post(`${baseUrl}api/profile`, user, setOptions())
      .map((profile: any) => {
        if (profile.isNew) {
          this.store.dispatch(new PromocodeActions.CreatePromocode(profile.id, profile.isNew));
          delete profile.isNew;
        }
        this.profileData = new Profile(profile);
        this.isLoading = false;
        return this.profileData;
      })
      .subscribe(
        () => this.profile.emit(this.profileData),
        () => this.profile.emit(null)
      );
  }
}
