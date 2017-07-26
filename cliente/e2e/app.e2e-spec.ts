import { ClientePage } from './app.po';

describe('cliente App', () => {
  let page: ClientePage;

  beforeEach(() => {
    page = new ClientePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
