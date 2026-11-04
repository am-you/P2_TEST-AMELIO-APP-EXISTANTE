import { UserMockService } from './user-mock.service';

// Am.Yo : le faux service renvoie un token
describe('UserMockService', () => {
  it('registers and returns a token', () => {
    const service = new UserMockService();
    const values: string[] = [];

    service.register({ firstName: 'Am', lastName: 'Test', login: 'am.test1', password: 'password' }).subscribe();
    service.login({ login: 'am.test1', password: 'password' }).subscribe((token) => values.push(token));

    expect(values).toEqual(['token']);
  });
});
