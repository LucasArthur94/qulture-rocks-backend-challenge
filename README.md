# Qulture Rocks Challenge

> Desafio técnico Backend feito em NestJS + Typescript

## Requisitos do Projeto
- Node 12
- Yarn
- Docker + Docker Compose

## Setup do Projeto
```sh
yarn
yarn build
yarn docker:dev
yarn dev
```

## Endpoints

### Usuários
- `GET /users`: Lista usuários
- `GET /users/:userId`: Obtém usuário
- `POST /users`: Cadastra usuário
- `PUT /users`: Edita usuário
- `DELETE /users`: Apaga usuário

### Tags
- `GET /tags`: Lista tags
- `GET /tags/:tagId`: Obtém tag
- `POST /tags`: Cadastra tag
- `PUT /tags`: Edita tag
- `DELETE /tags`: Apaga tag

### Segmentação
- `GET /segmentations`: Lista segmentações
- `GET /segmentations/:segmentationId/users`: Lista usuários dentro da segmentação
- `POST /segmentations`: Cadastra lista de segmentações
- `DELETE /segmentations`: Apaga segmentação

## Aplicação e Módulos

### Common
Diretório com arquivos em comum dos módulos (como a estratégia de `snake_case` do banco)

### Segmentations
Módulo central que controla usuários, tags e as segmentações

### Outros arquivos na raiz
- `app.module.ts`: Declaração global da aplicação, com todos os módulos
- `config.ts`: Arquivo com a configuração da aplicação, onde as variáveis de ambiente são declaradas
- `logger.ts`: Arquivo com customizações do `logger`, deixando ele mais estiloso
- `main.ts`: Arquivo com o boot da aplicação e a adição de `middlewares` (como o `class-validator`)

## Arquitetura dos Módulos

### Controllers
Declaração dos endpoints da API com a lógica básica necessária para cada endpoint

### DTO (Data Transfer Object)
Arquivos com as classes contratuais dos endpoints (validação usando o `class-validator`)

### Entities
Arquivos com as classes do banco de dados, usadas como base para os repositórios

### Logic
Lógicas complexas que não necessitam ficar nos `controllers` e podem ser extraídas e até compartilhadas

### Outros arquivos na raiz
- `test-helpers.ts`: Arquivo para declaração dos mocks dos repositórios do módulo
- `*.module.ts`: Declaração do módulo para o NestJS

## Testes

Para rodar os testes unitários (do `logic`) e de integração (`controllers` e `services`):

```sh
yarn test
```

## Pipeline
O projeto foi configurado com uma pipeline básica de deploy, sem ambiente de staging, onde cada branch roda o build e o teste do projeto e cada commit na master, além dos testes, executa um deploy no Heroku.

## Infraestrutura
O projeto está hospedado no [Heroku](https://qulture.herokuapp.com), com um banco PostgreSQL do próprio Heroku (via addon). O serviço já possui as segmentações cadastradas do documento do desafio, bem como dois usuários de exemplo (e as tags relacionadas) para validar esses exemplos.