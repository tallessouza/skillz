# Deep Explanation: Operador de Coalescência Nula (??)

## O que é

O operador de coalescência nula (`??`) é um operador lógico que retorna o operando do lado **direito** quando o do lado **esquerdo** é `null` ou `undefined`. Caso contrário, retorna o operando do lado **esquerdo**.

```
lado_esquerdo ?? lado_direito
```

- Se `lado_esquerdo` é `null` ou `undefined` → retorna `lado_direito`
- Se `lado_esquerdo` tem qualquer outro valor → retorna `lado_esquerdo`

## A diferença crítica: ?? vs ||

Este é o ponto mais importante e a fonte mais comum de bugs.

O operador `||` (OR lógico) retorna o lado direito quando o lado esquerdo é **falsy**. Em JavaScript, os valores falsy são: `false`, `0`, `""`, `null`, `undefined`, `NaN`.

O operador `??` retorna o lado direito **apenas** quando o lado esquerdo é `null` ou `undefined`.

```javascript
// Com ||
false || "default"    // "default" ← SUBSTITUIU false!
0 || "default"        // "default" ← SUBSTITUIU 0!
"" || "default"       // "default" ← SUBSTITUIU string vazia!

// Com ??
false ?? "default"    // false ← preservado
0 ?? "default"        // 0 ← preservado
"" ?? "default"       // "" ← preservado
null ?? "default"     // "default" ← correto
undefined ?? "default" // "default" ← correto
```

### Quando isso causa bugs reais

Imagine um campo de configuração onde `0` é um valor válido:

```javascript
const volume = userSettings.volume || 50
// Se o usuário definiu volume como 0 (mudo), || substitui por 50!

const volume = userSettings.volume ?? 50
// Se volume é 0, preserva 0. Só usa 50 se volume é null/undefined.
```

Ou um campo boolean:

```javascript
const notifications = user.enableNotifications || true
// Se o usuário desativou (false), || força true!

const notifications = user.enableNotifications ?? true
// Preserva false se o usuário escolheu desativar.
```

## Analogia do instrutor

O instrutor Rodrigo usa a analogia de "verificar se tem conteúdo":
- "Tem conteúdo aqui dentro? Mostra ele então."
- "Não tem nada? Mostra alguma coisa padrão."

O ponto chave é que `false`, `0`, `""`, `{}`, `[]` **são conteúdo** — são valores intencionais. Apenas `null` e `undefined` significam "não tem nada".

## Caso prático: Avatar do usuário

O exemplo do instrutor é perfeito para entender o uso real:

```javascript
const user = {
  name: "Rodrigo",
  avatar: undefined  // usuário não definiu avatar ainda
}

const profileImage = user.avatar ?? "default.png"
// undefined → usa default.png

// Depois o usuário define:
user.avatar = "rodrigo.png"
const profileImage = user.avatar ?? "default.png"
// "rodrigo.png" → usa o avatar do usuário
```

Esse padrão é extremamente comum em aplicações reais: exibir um valor padrão quando o usuário ainda não configurou algo.

## Encadeamento

Múltiplos `??` podem ser encadeados para criar uma cadeia de fallbacks:

```javascript
const displayName = user.nickname ?? user.name ?? "Anônimo"
```

Lê-se: "use nickname, senão name, senão Anônimo".

## Combinação com Optional Chaining (?.)

O `??` frequentemente aparece junto com `?.` (optional chaining):

```javascript
const theme = user?.settings?.theme ?? "light"
```

Se `user` é null, ou `settings` não existe, ou `theme` é undefined → usa `"light"`.

## Limitação: não misture com || ou && sem parênteses

JavaScript proíbe misturar `??` com `||` ou `&&` sem parênteses explícitos:

```javascript
// ERRO de sintaxe:
null || undefined ?? "default"

// Correto:
(null || undefined) ?? "default"
```

Isso foi uma decisão de design da linguagem para evitar ambiguidade.