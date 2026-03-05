# Code Examples: Comentarios em JavaScript

## Exemplo 1: Comentario de uma linha basico

```javascript
// Exibe texto no console do navegador
console.log("Hello World")
```

Quando o `//` e adicionado antes de um comando, ele deixa de ser executado:

```javascript
// console.log("Isso nao vai aparecer")
console.log("Isso vai aparecer")
```

## Exemplo 2: Comentario ao lado do codigo

```javascript
console.log("Bem-vindo!") // mensagem inicial exibida ao usuario
```

## Exemplo 3: Comentario de multiplas linhas

```javascript
/*
  Comentarios sao trechos de texto que podem ser
  adicionados junto com o codigo.
  O navegador ignora o texto marcado como comentario.
*/
console.log("Codigo executado normalmente")
```

## Exemplo 4: Comentario educativo (para quem esta aprendendo)

```javascript
/*
  Por que utilizar comentarios durante seus estudos:
  - Para fornecer informacoes adicionais sobre o que o codigo faz
  - Deixar lembretes de coisas a fazer
  - Relembrar no futuro o que aquilo faz
*/

// console.log() exibe uma mensagem no console do navegador
console.log("Aprendendo JavaScript")
```

## Exemplo 5: Evolucao — de comentado para auto-explicativo

### Versao iniciante (muitos comentarios):

```javascript
// busca todos os usuarios do banco de dados
const d = fetch("/api/users")

// converte a resposta pra JSON
const r = await d.json()

// filtra apenas os ativos
const f = r.filter(u => u.active)
```

### Versao madura (codigo auto-explicativo):

```javascript
const usersResponse = await fetch("/api/users")
const users = await usersResponse.json()
const activeUsers = users.filter(user => user.isActive)
```

Os comentarios se tornaram desnecessarios porque os nomes das variaveis ja descrevem o conteudo.

## Exemplo 6: Quando o comentario AGREGA valor

```javascript
// Regex extraida da RFC 5322 secao 3.2.3 — nao simplificar
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Timeout de 5s exigido pelo SLA do parceiro de pagamento
const paymentTimeoutInMs = 5000

// Workaround para bug do Safari 16.4 com position:sticky em tabelas
element.style.transform = "translateZ(0)"
```

## Exemplo 7: Posicionamento do comentario

```javascript
// Em cima — contexto geral para o bloco abaixo
const total = calcularTotal(itens)

const desconto = total * 0.1 // ao lado — nota especifica desta linha
```

Para comentarios de multiplas linhas, sempre posicione acima do bloco:

```javascript
/*
  Aplica desconto progressivo:
  - Ate 10 itens: 5%
  - 11-50 itens: 10%
  - Acima de 50: 15%
*/
const desconto = calcularDescontoProgressivo(quantidade)
```