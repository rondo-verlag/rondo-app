describe('Rondo Songbook App', () => {
  it('Visits the app root url and redirects to songlist', () => {
    cy.visit('/');
    cy.url().should('include', '/songlist');
    cy.get('#song-search-input').should('exist');
  });
});
