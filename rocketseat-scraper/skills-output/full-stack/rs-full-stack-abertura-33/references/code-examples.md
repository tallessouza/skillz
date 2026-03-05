# Code Examples: Introdução ao TypeScript

## Usando o TypeScript Playground

### Acesso

Acesse `typescriptlang.org/play` no navegador. O editor aparece com dois painéis:
- **Esquerda:** código TypeScript
- **Direita:** JavaScript compilado (output)

### Exemplo 1: Primeiro tipo

```typescript
// No Playground, digite isso no painel esquerdo:
let nome: string = "Rocketseat"
let idade: number = 25
let ativo: boolean = true

// O painel direito mostra o JavaScript gerado:
// let nome = "Rocketseat"
// let idade = 25
// let ativo = true
// Observe: os tipos desaparecem na compilação — são apenas para desenvolvimento
```

### Exemplo 2: Erro de tipo em tempo real

```typescript
let preco: number = 49.90

// Tente atribuir uma string — o Playground sublinha o erro imediatamente:
preco = "quarenta e nove" // Error: Type 'string' is not assignable to type 'number'
```

### Exemplo 3: Função tipada

```typescript
function somar(a: number, b: number): number {
  return a + b
}

const resultado = somar(10, 20) // resultado é inferido como number
// somar("10", 20) // Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

### Exemplo 4: Interface básica

```typescript
interface Usuario {
  nome: string
  email: string
  idade: number
}

const usuario: Usuario = {
  nome: "João",
  email: "joao@email.com",
  idade: 28
}

// Se faltar uma propriedade, o Playground mostra o erro:
// const incompleto: Usuario = { nome: "Maria" }
// Error: Type '{ nome: string; }' is missing the following properties: email, idade
```

### Exemplo 5: Compartilhando código

Após escrever um snippet no Playground:
1. Clique em **Share** no menu superior
2. Copie a URL gerada
3. Qualquer pessoa com a URL vê exatamente o mesmo código e configuração

Isso é útil para:
- Pedir ajuda com um problema de tipagem
- Compartilhar exemplos em estudos em grupo
- Reportar bugs do TypeScript com reprodução mínima

### Playground vs Projeto Local

| Aspecto | Playground | Projeto Local |
|---------|-----------|---------------|
| Setup | Zero | `npm init`, `tsc --init`, configuração |
| Velocidade de feedback | Instantâneo | Depende do build |
| Módulos/imports | Limitado | Completo |
| Bibliotecas externas | Não suporta | npm install |
| Ideal para | Aprender, testar tipos | Desenvolver aplicações |