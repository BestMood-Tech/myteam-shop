import { Headers, RequestOptions } from '@angular/http';

// export const baseUrl = 'https://oq7k3diobg.execute-api.eu-central-1.amazonaws.com/dev/';
export const baseUrl = 'http://localhost:3000/'; // for local development
// export const bucketUrl = 'https://s3.eu-central-1.amazonaws.com/bmt-media-shop-service-pdf/';
export const bucketUrl = 'http://localhost:8800/bmt-media-shop-service-pdf/'; // for local development
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

export class Search {
  public query: string;
  public movies: boolean;
  public games: boolean;
  public books: boolean;
  public date?: string;

  constructor(obj) {
    for (const key in obj) {
      if (key === 'movies' || key === 'games' || key === 'books') {
        this[key] = typeof obj[key] === 'boolean' ? obj[key] : obj[key] === 'true';
      } else {
        this[key] = obj[key];
      }
    }
  }
}

export class Currency {

  private static currency = [
    { name: 'USD', value: '$' },
    { name: 'EUR', value: '€' },
    { name: 'RUB', value: '₽' }
  ];

  public static getCurrency() {
    return this.currency;
  }

}
