# Deep Explanation: Tipagem em Objetos TypeScript

## Por que tipar objetos explicitamente?

O instrutor demonstra que quando voce cria `let user = {}`, o TypeScript infere que o objeto aceita "qualquer coisa". Isso anula a principal vantagem do TypeScript: detectar erros em tempo de desenvolvimento.

Ao declarar `let user: { name: string, age: number }`, o compilador passa a:
1. **Exigir todas as propriedades** — esquecer `age` causa erro imediato
2. **Validar tipos dos valores** — tentar atribuir `"X"` a `age` (number) e flagrado
3. **Restringir acesso** — `user.password` causa erro se nao declarado no tipo
4. **Oferecer autocomplete** — o editor mostra exatamente o que o objeto contem

## Propriedades opcionais com `?`

O instrutor usa o exemplo do avatar: quando um usuario se cadastra, pode nao ter foto ainda. A solucao e `avatarUrl?: string`.

Mecanica interna:
- `avatarUrl?: string` e equivalente a `avatarUrl: string | undefined`
- A propriedade pode ser completamente omitida do objeto (nao precisa nem existir como chave)
- Diferente de `avatarUrl: string | undefined`, onde a chave precisa existir com valor `undefined`

O `?` vai **antes** dos dois pontos: `prop?: tipo`. Essa e a sintaxe de propriedade opcional.

## Parametros de funcao como objetos

### Problema dos parametros posicionais

```typescript
signIn("rodrigo@email.com", "123")
```

Na chamada, nao fica claro qual e o email e qual e a senha. Com 3+ parametros do mesmo tipo, o risco de inversao e alto.

### Solucao: objeto desestruturado

```typescript
signIn({ email: "rodrigo@email.com", password: "123" })
```

Vantagens demonstradas pelo instrutor:
1. **Autocomplete** — dentro do objeto, Ctrl+Space mostra as opcoes disponiveis
2. **Deteccao de typos** — `pasword` (com um S) e flagrado como propriedade inexistente
3. **Propriedades extras rejeitadas** — passar `avatar` quando nao esta no tipo causa erro
4. **Propriedades faltantes detectadas** — esquecer `password` e flagrado imediatamente

### Desestruturar vs nao desestruturar

O instrutor mostra duas formas:

**Desestruturado** — acesso direto a `email` e `password`:
```typescript
function signIn({ email, password }: { email: string, password: string }) {
  console.log(email)
}
```

**Nomeado** — acesso via `data.email`, `data.password`:
```typescript
function signIn(data: { email: string, password: string }) {
  console.log(data.email)
}
```

Ambas sao validas. A escolha depende de preferencia e contexto.

## Comportamento visual no editor

O instrutor destaca que variaveis/parametros nao utilizados ficam "apagados" (opacidade reduzida) no VS Code. Isso e um indicador visual do TypeScript de que algo nao esta sendo usado — nao e um erro, mas um aviso visual.

## O que o compilador detecta (resumo dos exemplos da aula)

| Erro | Mensagem aproximada |
|------|---------------------|
| Propriedade obrigatoria faltando | `Property 'age' is missing in type` |
| Tipo errado no valor | `Type 'string' is not assignable to type 'number'` |
| Acesso a propriedade inexistente | `Property 'password' does not exist on type` |
| Typo em nome de propriedade | `Object literal may only specify known properties. Did you mean 'password'?` |
| Propriedade extra no objeto literal | `'avatar' does not exist in type` |