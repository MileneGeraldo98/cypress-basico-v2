
Cypress.Commands.add('fillMandatoryFieldsAndSubmit' , ()=> {
    cy.get('#firstName').type('Milene')
    cy.get('#lastName').type('Geraldo')
    cy.get('#email').type('milene.geraldo@teste.com')
    cy.get('#open-text-area').type('teste')
    cy.get('.button').click()
})