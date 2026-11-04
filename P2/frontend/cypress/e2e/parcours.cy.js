// Am.Yo : inscription, connexion, puis le parcours étudiant
const login = `am.test${Date.now()}`;
const email = `lea.${Date.now()}@test.fr`;

describe('Parcours bibliothèque', () => {
  // Am.Yo : sans JWT, la liste renvoie vers /login
  it('bloque les étudiants sans connexion', () => {
    cy.visit('/students');
    cy.url().should('include', '/login');
    cy.contains('h5', 'Login');
  });

  // Am.Yo : formulaire de connexion vide
  it('refuse une connexion vide', () => {
    cy.visit('/login');
    cy.contains('button', 'Sign in').click();
    cy.contains('Login is required');
    cy.contains('Password is required');
  });

  // Am.Yo : formulaire d'inscription vide
  it('refuse une inscription vide', () => {
    cy.visit('/register');
    cy.contains('button', 'Register').click();
    cy.contains('First Name is required');
    cy.contains('Login is required');
  });

  // Am.Yo : crée un agent, refuse un mauvais mot de passe, puis connecte
  it('inscrit puis connecte un agent', () => {
    cy.intercept('POST', '/api/register').as('register');
    cy.visit('/register', {
      onBeforeLoad(win) {
        cy.stub(win, 'alert').as('registered');
      },
    });
    cy.get('input[formcontrolname=firstName]').type('Am');
    cy.get('input[formcontrolname=lastName]').type('Test');
    cy.get('input[formcontrolname=login]').type(login);
    cy.get('input[formcontrolname=password]').type('password');
    cy.contains('button', 'Register').click();
    cy.wait('@register').its('response.statusCode').should('eq', 201);
    cy.get('@registered').should('have.been.called');

    cy.visit('/login');
    cy.get('input[formcontrolname=login]').type(login);
    cy.get('input[formcontrolname=password]').type('wrong');
    cy.contains('button', 'Sign in').click();
    cy.contains('Invalid credentials');

    cy.get('input[formcontrolname=password]').clear().type('password');
    cy.contains('button', 'Sign in').click();
    cy.url().should('include', '/students');
    cy.contains('h5', 'Students');
  });

  // Am.Yo : ajoute, consulte, modifie, supprime, puis se déconnecte
  it('gère un étudiant puis se déconnecte', () => {
    cy.visit('/login');
    cy.get('input[formcontrolname=login]').type(login);
    cy.get('input[formcontrolname=password]').type('password');
    cy.contains('button', 'Sign in').click();
    cy.url().should('include', '/students');

    cy.contains('a', 'Add student').click();
    cy.contains('button', 'Save').click();
    cy.contains('First name is required');
    cy.contains('A valid email is required');

    cy.get('input[formcontrolname=firstName]').type('Lea');
    cy.get('input[formcontrolname=lastName]').type('Martin');
    cy.get('input[formcontrolname=email]').type(email);
    cy.contains('button', 'Save').click();
    cy.contains(email).closest('div.border').as('row');
    cy.get('@row').contains('Lea Martin');

    cy.get('@row').contains('a', 'Details').click();
    cy.contains('First name: Lea');
    cy.contains('Email: ' + email);
    cy.contains('a', 'Edit').click();
    cy.contains('h5', 'Edit student');
    cy.get('input[formcontrolname=lastName]').should('have.value', 'Martin').clear().type('Bernard');
    cy.contains('button', 'Save').click();
    cy.contains(email).closest('div.border').as('edited');
    cy.get('@edited').contains('Lea Bernard');

    cy.get('@edited').contains('button', 'Delete').click();
    cy.contains(email).should('not.exist');

    cy.contains('button', 'Log out').click();
    cy.url().should('include', '/login');
    cy.visit('/students');
    cy.url().should('include', '/login');
  });
});
