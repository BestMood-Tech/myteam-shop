export class Product {
  public id: string;
  public type: string;
  public name: string;
  public cover: string;
  public description: string;
  public vote: number;
  public voteCount?: number;
  public price: number;
  public year: string;
  public trailer?: string;
  public readCount?: number;
  public homepage?: string;
  public websites?: Website[];
  public esrb?: string;
  public status?: string;
  public developers?: Developer[] | number[];
  public genres?: Genre[] | number[];
  public productionCompanies?: Company[];
  public voteAverage?: string;
  public credits?: Credit[];

  constructor(obj) {
    Object.keys(obj).forEach((key) => {
      this[key] = obj[key];
    });
  }
}

export interface Website {
  category: number;
  url: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Developer {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
}

export interface Credit {
  name: string;
  profilePath: string;
}
