export class Product {
  public id: string;
  public type: string;
  public name: string;
  public cover: string;
  public description: string;
  public vote: string;
  public voteCount: string;
  public price: string;
  public year: string;
  public trailer?: string;
  public readCount?: string;
  public homepage?: string;
  public websites?: Website[];
  public esrb?: string;
  public status?: string;
  public developers?: Developer[];
  public genres?: Genre[];
  public productionCompanies?: Company[];
  public voteAverage?: string;
  public credits: Credit[];

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
  name: string;
}

export interface Developer {
  name: string;
}

export interface Company {
  name: string;
}

export interface Credit {
  name: string;
  profile_path: string;
}
