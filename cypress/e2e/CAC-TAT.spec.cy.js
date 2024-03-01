
describe('Central de Atendimento ao Cliente', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  });

  it('Verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  });

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    cy.clock()
    cy.get('#firstName').type('Milene')
    cy.get('#lastName').type('Geraldo')
    cy.get('#email').type('milene.geraldo@teste.com')
    cy.get('#open-text-area').type('teste, teste, teste, teste, teste, teste', {delay:0})
    cy.contains('.button', 'Enviar').click()

    cy.get('.success').should('be.visible')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  });

  it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()
    cy.get('#firstName').type('Milene')
    cy.get('#lastName').type('Geraldo')
    cy.get('#email').type('milene.geraldo@teste,com')
    cy.get('#open-text-area').type('teste, teste, teste, teste, teste, teste', {delay:0})
    cy.contains('.button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)

    cy.get('.error').should('not.be.visible')
  });

  it('Verifica número de telefone', () => {
    cy.get('#phone')
    .type('a,b,c,d')
    .should('have.value', '')
  });

  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()
    cy.get('#firstName').type('Milene')
    cy.get('#lastName').type('Geraldo')
    cy.get('#email').type('milene.geraldo@teste.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('teste')
    cy.get('.button',).click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)

    cy.get('.error').should('not.be.visible')
  });

  it('Preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Milene')
      .should('have.value', 'Milene')
      .clear()
      .should('have.value', '')

      cy.get('#lastName')
        .type('Geraldo')
        .should('have.value', 'Geraldo')
        .clear()
        .should('have.value', '')

      cy.get('#email')
        .type('milene.geraldo@teste.com')
        .should('have.value', 'milene.geraldo@teste.com')
        .clear()
        .should('have.value', '')
      
      cy.get('#phone')
        .type('123468')
        .should('have.value', '123468')
        .clear()
        .should('have.value', '')
  });

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.', () => {
      cy.clock()
      cy.contains('.button', 'Enviar').click()
      cy.get('.error').should('be.visible')

      cy.tick(3000)

      cy.get('.error').should('not.be.visible')
  });

  it('Envia o formuário com sucesso usando um comando customizado', () => {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  });

  it('Seleciona um produto (YouTube) por seu texto', () => {
    cy.get('select').select('YouTube')
      .should('have.value', 'youtube') // Value
  });

  it('Seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('select').select('mentoria')
      .should('have.value', 'mentoria')
  });

  it('Seleciona um produto (Blog) por seu índice', () => {
    cy.get('select').select(1)
      .should('have.value', 'blog')
  });

  it('Marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"]')
      .check('feedback')
      .should('have.value', 'feedback')
  });

  it('Marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)   // 3 elementos
      .each(($radio) => {         // Pegar cada um dos elementos
        cy.wrap($radio).check()  // Para empacotar cada um dos elementos
        cy.wrap($radio).should('be.checked')
      })
  });

  it('Marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .last() // O ultimo elemento
      .uncheck()
      .should('not.be.checked')
  });

  it('Seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type=file]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(($input) => {

        expect($input[0].files[0].name).to.equal('example.json')
      })
  });

  it('Seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type=file]')
      .should('not.be.value')
      .selectFile('./cypress/fixtures/example.json' , {action: 'drag-drop'})
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  });

  it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type=file]')
      .selectFile('@sampleFile')
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  });

  it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a')
      .should('have.attr', 'target' , '_blank')
  });

  it('Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('Talking About Testing').should('be.visible')
  });

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show') // Forçar o elemento a visibilidade
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide') // Esconder
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('Preenche a area de texto usando o comando invoke', () => {
    const longText = Cypress._.repeat('0,1,2,3,4', 20)
    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)
  });

  it('Faz uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should((response)=> {
        const {status, statusText, body} = response // Desestruturar o código
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  });

  it('Encontre o gato', () => {
    cy.get('#cat')
      .invoke('show')
      .should('be.visible')
  });
});