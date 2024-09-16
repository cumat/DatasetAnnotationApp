// cypress/integration/home_page_spec.js

describe('Home Page E2E Test', () => {
  beforeEach(() => {
    // Visit the homepage before running the tests
    cy.visit('127.0.0.1:5000/');
  });

  it('should display the correct dataset name', () => {
    // Check if the dataset name is displayed correctly
    cy.get('#dataset-name').should('have.text', 'basic-dataset-example');
  });

  it('should render home buttons with correct attributes', () => {
    // Verify that the home buttons have the correct attributes
    cy.get('home-button').first().should(($button) => {
      const title = $button.find('.home-button-title').text();
      const description = $button.find('.home-button-description').text();
      const href = $button.find('a').attr('href');

      expect(title).to.equal('Annotate Dataset');
      expect(description).to.equal('This section allows you to annotate the dataset.');
      expect(href).to.equal('annotate');
    });

    cy.get('home-button').eq(1).should(($button) => {
      const title = $button.find('.home-button-title').text();
      const description = $button.find('.home-button-description').text();
      const href = $button.find('a').attr('href');

      expect(title).to.equal('Compare Annotations');
      expect(description).to.equal('This section allows you to compare annotations.');
      expect(href).to.equal('compare');
    });
  });

  it('should navigate to the correct pages when home buttons are clicked', () => {
    // Click on the first button and verify navigation
    cy.get('home-button').first().find('a').click();
    cy.url().should('include', '/login');

    // Navigate back and click the second button
    cy.go('back');
    cy.get('home-button').eq(1).find('a').click();
    cy.url().should('include', '/compare');
  });
});
