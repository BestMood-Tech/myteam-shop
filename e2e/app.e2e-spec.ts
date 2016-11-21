import { MyteamShopPage } from './app.po';

describe('myteam-shop App', function() {
  let page: MyteamShopPage;

  beforeEach(() => {
    page = new MyteamShopPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
