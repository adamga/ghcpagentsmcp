const makeUser = (label) => ({
  username: `${label}${Date.now()}${Math.floor(Math.random() * 1000)}`,
  password: `Pass-${label}-${Math.random().toString(36).slice(2)}!`,
});

const registerUser = (user) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:4000/api/register',
    body: user,
    failOnStatusCode: false,
  });
};

const loginUser = (user) => {
  cy.contains('Login').click();
  cy.get('input[name="username"]').type(user.username);
  cy.get('input[name="password"]').type(user.password);
  cy.get('button#login').click();
};

describe('Book Favorites App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should allow a new user to register and login', () => {
    const user = makeUser('register');
    cy.contains('Create Account').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#register').click();
    cy.contains('Registration successful! You can now log in.').should('exist');
    cy.wait(2000);
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    cy.contains(`Hi, ${user.username}`).should('exist');
    cy.contains('Favorites').should('exist');
  });

  it('should search, sort, and add a book to favorites', () => {
    const user = makeUser('books');
    registerUser(user);
    loginUser(user);
    cy.contains('Books').click();
    cy.contains('h2', 'Books').should('exist');
    cy.get('input[name="book-search"]').type('orwell');
    cy.contains('George Orwell').should('exist');
    cy.get('select').first().select('Author');
    cy.get('select').last().select('Descending');
    cy.get('button').contains('Add to Favorites').first().click();
    cy.get('button').contains('In Favorites').should('be.disabled');
    cy.get('a#favorites-link').click();
    cy.get('h2').contains('My Favorite Books').should('exist');
    cy.contains('George Orwell').should('exist');
  });

  it('should remove and clear favorites', () => {
    const user = makeUser('favorites');
    registerUser(user);
    loginUser(user);
    cy.contains('Books').click();
    cy.get('button').contains('Add to Favorites').first().click();
    cy.get('a#favorites-link').click();
    cy.get('button').contains('Remove').click();
    cy.contains('No favorite books yet.').should('exist');
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Favorites').first().click();
    cy.get('button').contains('Add to Favorites').first().click();
    cy.get('a#favorites-link').click();
    cy.get('button').contains('Clear All Favorites').click();
    cy.contains('No favorite books yet.').should('exist');
  });

  it('should logout and protect routes', () => {
    const user = makeUser('logout');
    registerUser(user);
    loginUser(user);
    cy.get('button#logout').click();
    cy.contains('Login').should('exist');
    cy.visit('http://localhost:5173/books');
    cy.url().should('eq', 'http://localhost:5173/');
  });
});
