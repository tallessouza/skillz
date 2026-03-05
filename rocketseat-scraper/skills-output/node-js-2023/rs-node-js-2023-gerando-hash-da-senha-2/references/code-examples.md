# Code Examples: Gerando Hash da Senha

## Instalacao

```bash
# Apenas bcryptjs — tipagens ja estao incluidas
npm install bcryptjs
```

## Importacao

```typescript
import { hash } from 'bcryptjs'
```

## Uso basico: hash com salt rounds

```typescript
// password: senha em plaintext do usuario
// 8: numero de salt rounds (padrao recomendado)
const hashedPassword = await hash(password, 8)
// Resultado: "$2a$08$..." (string com salt embutido + hash)
```

## Fluxo completo no controller NestJS

Este e o exemplo da aula — um endpoint POST para criar contas:

```typescript
import { Body, Controller, Post } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    // Gerar hash ANTES de salvar
    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Nunca salvar 'password' diretamente
      },
    })
  }
}
```

## Variacoes de salt rounds

```typescript
// Padrao recomendado (256 iteracoes)
const hashed = await hash(password, 8)

// Mais seguro, mais lento (1024 iteracoes)
const hashedStrong = await hash(password, 10)

// Uso com salt explicito (menos comum)
import { genSalt, hash } from 'bcryptjs'
const salt = await genSalt(8)
const hashedWithSalt = await hash(password, salt)
```

## Verificacao no banco de dados

Apos criar o usuario, ao verificar no banco de dados, a senha aparece como hash:

```
// Antes (plaintext — ERRADO):
password: "123456"

// Depois (hash — CORRETO):
password: "$2a$08$K4GxJd8fQ7mN2pX..."
```

O formato `$2a$08$...` indica:
- `$2a$` — versao do algoritmo bcrypt
- `08$` — numero de rounds usado
- Restante — salt (22 chars) + hash (31 chars)