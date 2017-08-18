import { Headers, RequestOptions } from '@angular/http';

export const baseUrl = 'https://au3ms2udr0.execute-api.eu-central-1.amazonaws.com/dev/';
/* export const baseUrl = 'http://localhost:3000/'; // for local development */
export const siteKeyGC = '6LduCCoUAAAAABhZ822fD5A_BqNQH0RJMSV_DJjn';

export function setOptions() {
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
