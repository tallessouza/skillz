# Code Examples: Envio de E-mail com Nodemailer

## Instalacao

```bash
# Instalar Nodemailer
bun add nodemailer

# Instalar tipagens (devDependency)
bun add -d @types/nodemailer
```

## lib/mail.ts completo

```typescript
import nodemailer from 'nodemailer'

const account = await nodemailer.createTestAccount()

const transporter = nodemailer.createTransport({
  host: account.smtp.host,
  port: account.smtp.port,
  secure: account.smtp.secure,
  debug: true,
  auth: {
    user: account.user,
    pass: account.pass,
  },
})

export const mail = transporter
```

## Uso na rota de autenticacao

```typescript
import nodemailer from 'nodemailer'
import { mail } from '../lib/mail'

// Dentro da rota send-auth-link
const info = await mail.sendMail({
  from: {
    name: 'PizzaShop',
    address: 'hi@pizzashop.com',
  },
  to: user.email,
  subject: 'Authenticate to Pizza Shop',
  text: `Use the following link to authenticate on Pizza Shop: ${authLink.toString()}`,
})

// Logar URL para visualizar no Ethereal (dev only)
console.log(nodemailer.getTestMessageUrl(info))
```

## Variacao: com HTML template

```typescript
const info = await mail.sendMail({
  from: {
    name: 'PizzaShop',
    address: 'hi@pizzashop.com',
  },
  to: user.email,
  subject: 'Authenticate to Pizza Shop',
  text: `Use the following link to authenticate on Pizza Shop: ${authLink.toString()}`,
  html: `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>Pizza Shop</h1>
      <p>Use the following link to authenticate:</p>
      <a href="${authLink.toString()}">${authLink.toString()}</a>
    </div>
  `,
})
```

## Variacao: transporter para producao

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const mail = transporter
```

## Formato do objeto from

```typescript
// Formato objeto (recomendado) — separa nome e endereco
from: {
  name: 'PizzaShop',
  address: 'hi@pizzashop.com',
}

// Formato string (alternativa)
from: 'PizzaShop <hi@pizzashop.com>'
```

## Console output do sendMail

```
// info retornado pelo sendMail contem:
{
  messageId: '<abc123@ethereal.email>',
  envelope: { from: 'hi@pizzashop.com', to: ['user@example.com'] },
  accepted: ['user@example.com'],
  rejected: [],
  response: '250 Accepted'
}

// getTestMessageUrl gera algo como:
// https://ethereal.email/message/abc123
```