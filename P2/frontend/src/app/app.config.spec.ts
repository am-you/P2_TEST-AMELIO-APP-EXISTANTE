import { appConfig } from './app.config';
import { routes } from './app.routes';

// Am.Yo : la config HTTP et les routes étudiants existent
describe('appConfig', () => {
  it('provides the application services and the student routes', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
    expect(routes.map((route) => route.path)).toEqual([
      '',
      'register',
      'login',
      'students',
      'students/new',
      'students/:id',
      'students/:id/edit',
    ]);
    expect(routes.filter((route) => route.path?.startsWith('students')).every((route) => route.canActivate?.length)).toBe(true);
  });
});
