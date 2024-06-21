# App

Gympass style app.

## RFs (Requisitos funcionais)

- [X] Deve ser possível se cadastrar;
- [X] Deve ser possível se autenticar;
- [X] Deve ser possível obter o perfil de um usuário logado;
- [X] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [X] Deve ser possível o usuário obter seu histórico de check-ins;
- [X] Deve ser possível o usuário buscar academias próximas (até 10km);
- [X] Deve ser possível o usuário buscar academias pelo nome;
- [X] Deve ser possível o usuário realizar check-in em uma academia;
- [X] Deve ser possível validar o check-in de um usuário;
- [X] Deve ser possível cadastrar uma academia;


## RNs (Regras de negócio)

- [X] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [X] O usuário não pode fazer 2 check-ins no mesmo dia;
- [X] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [X] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;


## RNFs (Requisitos não funcionais)

- [X] A senha do usuário precisa estar criptografada;
- [X] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [X] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token)


## Scripts para testes E2E (versão antiga do vitest)

1. Cria um pacote npm (npm init -y) dentro da pasta vitest-environment-prisma
2. Altera o arquivo definido em vite.config.mts para 'prisma'
3. Adiciona os scripts abaixo no package.json

```javascript
"test:create-prisma-environment": "npm link ./prisma/vitest-environment-prisma",
"test:install-prisma-environment": "npm link vitest-environment-prisma",
"pretest:e2e": "run-s test:create-prisma-environment test:install-prisma-environment",
```


## Setup para testes E2E (usando o MySQL + Prisma)

Define o arquivo ```prisma-test-environment.ts``` dessa forma:

```javascript
import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(databaseName: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.pathname = `/${databaseName}`

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const databaseName = `api_solid_test_${randomUUID().replace(/-/g, '_')}`
    const databaseURL = generateDatabaseURL(databaseName)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP DATABASE IF EXISTS ${databaseName};`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
```


Cria um arquivo de configuração para os testes

```javascript
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomInt } from 'crypto';

config({
  path: '.env',
  override: true,
});

config({
  path: '.env.test',
  override: true,
});

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(databaseId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please, provide a valid test database URL.');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.pathname = '/' + databaseId;

  return url.toString();
}

const databaseId = `testDb${randomInt(100)}`;

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(databaseId);
  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${databaseId};`);
  await prisma.$disconnect();
});
```


Altera a variável de ambiente usando o usuário root

```
DATABASE_URL="mysql://root:ROOT_PASSWORD@localhost:3306/maindatabase"
```