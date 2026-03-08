---
name: rs-full-stack-criando-sign-up
description: "Applies page duplication and adaptation pattern when building signup forms from existing signin pages in React projects. Use when user asks to 'create signup page', 'duplicate signin for register', 'build registration form', 'add signup route', or 'create account page'. Enforces state management for name/email/password/passwordConfirm, route registration in layout, and link navigation between auth pages. Make sure to use this skill whenever creating auth pages that share structure with existing ones. Not for backend authentication logic, JWT handling, or API integration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-authentication
  tags: [react, signup, forms, routing, authentication, useState]
---

# Criando SignUp a partir de SignIn

> Quando duas paginas compartilham estrutura, duplique e adapte em vez de criar do zero.

## Rules

1. **Duplique a pagina existente** — copie o arquivo SignIn e renomeie para SignUp, porque reescrever estrutura identica desperica tempo e introduz inconsistencias
2. **Registre a rota no layout de autenticacao** — adicione a rota do SignUp no AuthLayout/AuthRoutes imediatamente apos criar o arquivo, porque pagina sem rota e pagina invisivel
3. **Padronize nomes de pastas e arquivos** — use o mesmo padrao de casing do projeto (kebab-case ou camelCase), porque inconsistencia causa confusao na navegacao
4. **Adicione todos os estados do formulario** — SignUp precisa de `name`, `email`, `password` e `passwordConfirm`, porque campos faltantes quebram a experiencia de cadastro
5. **Ajuste placeholders e labels** — cada input deve ter placeholder descritivo do seu conteudo, porque inputs genericos confundem o usuario
6. **Inverta os links de navegacao** — SignIn aponta para SignUp ("Criar conta") e SignUp aponta para SignIn ("Ja tenho uma conta"), porque navegacao bidirecional e obrigatoria em fluxos de auth

## Steps

### Step 1: Duplicar a pagina SignIn
```
Copie o arquivo/componente SignIn inteiro e renomeie para SignUp.
Renomeie o componente interno de SignIn para SignUp.
```

### Step 2: Registrar a rota
```tsx
// No arquivo de rotas do auth layout
import { SignUp } from "./sign-up"

// Adicione a rota
<Route path="/sign-up" element={<SignUp />} />
```

### Step 3: Adicionar estados do formulario
```tsx
const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [passwordConfirm, setPasswordConfirm] = useState("")
```

### Step 4: Ajustar os inputs
```tsx
<Input
  label="name"
  placeholder="Seu nome"
  value={name}
  onChange={e => setName(e.target.value)}
/>

<Input
  label="email"
  type="email"
  placeholder="Seu e-mail"
  value={email}
  onChange={e => setEmail(e.target.value)}
/>

<Input
  label="password"
  type="password"
  placeholder="Senha"
  value={password}
  onChange={e => setPassword(e.target.value)}
/>

<Input
  label="passwordConfirm"
  type="password"
  placeholder="Confirmação da senha"
  value={passwordConfirm}
  onChange={e => setPasswordConfirm(e.target.value)}
/>
```

### Step 5: Ajustar botao e link
```tsx
<Button type="submit">Cadastrar</Button>

<Link to="/">Já tenho uma conta</Link>
```

## Example

**Before (SignIn original):**
```tsx
export function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <form onSubmit={handleSubmit}>
      <Input label="email" type="email" placeholder="Seu e-mail" />
      <Input label="password" type="password" placeholder="Senha" />
      <Button>Entrar</Button>
      <Link to="/sign-up">Criar conta</Link>
    </form>
  )
}
```

**After (SignUp adaptado):**
```tsx
export function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  return (
    <form onSubmit={handleSubmit}>
      <Input label="name" placeholder="Seu nome" />
      <Input label="email" type="email" placeholder="Seu e-mail" />
      <Input label="password" type="password" placeholder="Senha" />
      <Input label="passwordConfirm" type="password" placeholder="Confirmação da senha" />
      <Button>Cadastrar</Button>
      <Link to="/">Já tenho uma conta</Link>
    </form>
  )
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina nova com 80%+ de estrutura igual a existente | Duplique e adapte |
| Input sem type definido | Mantenha sem type — o padrao e "text" |
| Formulario de cadastro | Sempre inclua confirmacao de senha |
| Links entre auth pages | Bidirecional: signin↔signup |
| Padrao de nomes de pasta inconsistente | Corrija para o padrao do projeto antes de continuar |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Reescrever pagina do zero quando existe similar | Duplique e adapte a existente |
| Esquecer de registrar a rota no layout | Registre a rota imediatamente apos criar o arquivo |
| Usar mesmo estado de SignIn sem adicionar campos extras | Adicione `name` e `passwordConfirm` |
| Link de "Criar conta" no SignUp | Use "Ja tenho uma conta" apontando para SignIn |
| Botao "Entrar" no SignUp | Use "Cadastrar" |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Pagina SignUp exibe tela em branco | Rota nao registrada no layout de autenticacao | Adicione `<Route path="/sign-up" element={<SignUp />} />` |
| Link "Criar conta" nao navega | Path do `<Link to="...">` incorreto | Verifique se o `to` corresponde ao path registrado na rota |
| Componente ainda mostra "Entrar" em vez de "Cadastrar" | Conteudo nao adaptado apos duplicar SignIn | Ajuste texto do botao e link de navegacao |
| Estado do formulario nao atualiza | `onChange` nao conectado ao `setState` | Adicione `onChange={e => setField(e.target.value)}` em cada input |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre reuso de paginas e padronizacao de auth flows
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes