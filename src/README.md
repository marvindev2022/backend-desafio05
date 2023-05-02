![](https://i.imgur.com/xG74tOh.png)

# _Desafio Final Módulo 5_ - Backend Inimigos Do Front

Este é um projeto de exemplo para demonstrar a utilização de rotas em uma aplicação _Express.js_ .

O projeto é composto de rotas para o cadastro de usuários e clientes, além de uma rota para atualização de informações do usuário.

## _Instalação_

- _NodeJS_ é um pré-requisito para utilização do projeto.

- Após a instalação do _NODEJS_ é necessário que as dependencias sejam instaladas a partir do seguinte comando:

       npm install

## _Utilização_

- Para iniciar o servidor, execute o comando:

       npm start

- O servidor será iniciado na porta _4000_ e você poderá acessá-lo em:

  _<http://localhost:4000/>_ ou **<https://backend-desafio-05.herokuapp.com/>**.

## _Rotas_

`javascript

GET /
// Retorna uma mensagem indicando que o servidor está online.

- POST /user
  // Cadastra um novo usuário na aplicação. Os dados do usuário devem ser enviados no corpo da requisição no formato JSON, com os seguintes campos:

name: "nome completo do usuário."
email: "endereço de e-mail do usuário."
password: "senha do usuário."
// Exemplo de requisição:

json

{
name: "João da Silva",
email: "joao.silva@gmail.com",
password: "123456"
}

- POST /login
  // Realiza o login do usuário na aplicação. Os dados do usuário devem ser enviados no corpo da requisição no formato JSON, com os seguintes campos:

email: "endereço de e-mail do usuário."
password: "senha do usuário."
// Exemplo de requisição:

json

{
"email": "joao.silva@gmail.com",
"password": "123456"
}

- POST /client
  // Cadastra um novo cliente na aplicação. Os dados do cliente devem ser enviados no corpo da requisição no formato JSON, com os seguintes campos:

name: "nome completo do cliente."
email: "endereço de e-mail do cliente."

// Exemplo de requisição:

.json

{
"name": "Maria da Silva",
"email": "maria.silva@gmail.com"
}
// Obs.: É necessário uma autenticação através do token JWT enviado no cabeçalho da requisição.

- PUT /user
  // Atualiza as informações do usuário na aplicação. Os dados do usuário devem ser enviados no corpo da requisição no formato JSON, com os seguintes campos:

name: "nome completo do usuário."
email: "endereço de e-mail do usuário."
password: "nova senha do usuário."

// Exemplo de requisição:

.json

{
"name": "João da Silva",
"email": "joao.silva@gmail.com",
"password": "654321"
}
// Obs.: É necessário uma autenticação através do token JWT enviado no cabeçalho da requisição.
`

## _Middlewares_

- validateToken

- Middleware utilizado para validar o token JWT enviado no cabeçalho da requisição. Caso o token seja válido, o usuário é autenticado e a requisição é processada normalmente. Caso contrário, é retornado um erro indicando
