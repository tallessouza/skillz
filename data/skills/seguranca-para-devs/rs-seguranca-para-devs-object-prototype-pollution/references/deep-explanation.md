# Deep Explanation: Prototype Pollution

## Como funciona o ataque

Cada objeto em JavaScript herda de um protótipo. Quando você acessa `obj.propriedade`, o engine procura primeiro no próprio objeto, depois sobe a cadeia de protótipos. O protótipo base de todos os objetos é `Object.prototype`.

A propriedade especial `__proto__` é um accessor que aponta para o protótipo do objeto. Quando uma função de DeepMerge encontra `__proto__` como chave em um payload JSON, ela não cria uma propriedade normal — ela **modifica o protótipo** do objeto. Como todos os objetos compartilham o mesmo `Object.prototype`, uma única mutação afeta **todos os objetos** da aplicação.

## O cenário do instrutor

O instrutor demonstrou com uma coleção simples de pessoas:

```javascript
const pessoas = {
  1: { nome: 'Ana', idade: 25 },
  2: { nome: 'Bruno', idade: 30 },
  // ...
}
```

Ao chamar `updatePessoa('1', '{"idade": 34, "__proto__": {"admin": true}}')`:
1. A propriedade `admin: true` é injetada no `Object.prototype`
2. `pessoas[1].admin` → `true`
3. `pessoas[2].admin` → `true` (outro objeto, mesmo protótipo)
4. `({}).admin` → `true` (objeto vazio, herda do protótipo poluído)

## Por que é catastrófico no servidor

O instrutor enfatizou que no Node.js o impacto é multiplicado: o protótipo poluído persiste enquanto o processo estiver rodando. Se um atacante faz o ataque uma vez, **todas as requisições subsequentes de todos os usuários** são afetadas. O servidor pode ficar semanas rodando com o protótipo poluído, redirecionando dados para um site malicioso.

## O ataque de redirecionamento

O cenário mais prático demonstrado foi a substituição de URLs de backend:

```javascript
const defaultConfig = { theme: 'light', backend: 'https://api.exemplo.com' }
const config = { theme: 'dark', autoSave: true }
// config.backend não existe, fallback para defaultConfig.backend

// Atacante polui o protótipo:
// __proto__.backend = 'https://sitehacker.com'

// Agora config.backend existe (no protótipo) → 'https://sitehacker.com'
// O sistema nunca chega ao fallback do defaultConfig
```

O teste `config.backend` retorna `true` porque a propriedade existe no protótipo, e o código nunca usa `hasOwnProperty` para distinguir propriedades próprias de herdadas.

## Filosofia do instrutor: "Não confie no cliente"

O instrutor contextualizou Prototype Pollution dentro de um princípio maior:

1. **O cliente é território do hacker** — o console dá acesso total ao código e ao estado da aplicação
2. **Lógica de negócio no cliente é OK, mas deve ser replicada no servidor** — o Gmail tem lógica rica no front, mas valida tudo no back
3. **Segredos nunca vão para o cliente** — chaves de API, endpoints secretos, tokens de parceiros ficam no servidor
4. **Criptografia no cliente é inútil** — com Let's Encrypt, HTTPS é trivial; criptografar no JS do navegador era prática de quando HTTPS era difícil de obter
5. **O único dado que vai para o cliente é o identificador de sessão** — cookie de sessão ou JWT

## Por que evitar DeepMerge

O argumento do instrutor: se sua estrutura de dados é flat (como uma tabela de banco de dados com nome e idade), DeepMerge é overengineering. Um simples spread (`{ ...target, ...source }`) resolve sem abrir superfície de ataque. DeepMerge só faz sentido quando você tem objetos aninhados como propriedades (ex: `{ permissoes: { admin: true, editor: false } }`).