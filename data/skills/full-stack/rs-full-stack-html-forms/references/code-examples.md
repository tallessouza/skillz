# Code Examples: HTML Forms

## Exemplo 1: Formulário mínimo (da aula)

O instrutor criou este formulário como primeira demonstração:

```html
<form action="/" method="GET">
  <input type="text" name="nome" />
  <button type="submit">SUBMIT</button>
</form>
```

**Comportamento:** Ao digitar "Mike" e submeter, a URL muda para `/?nome=Mike`.

## Exemplo 2: Formulário com POST (da aula)

```html
<form action="/" method="POST">
  <input type="text" name="nome" />
  <button type="submit">SUBMIT</button>
</form>
```

**Comportamento:** Ao submeter, a página recarrega mas os dados NÃO aparecem na URL. Sem back-end, os dados não são visíveis em lugar nenhum no navegador.

## Exemplo 3: Formulário sem atributos (demonstração de defaults)

```html
<form>
  <input type="text" name="nome" />
  <button type="submit">SUBMIT</button>
</form>
```

**Comportamento:** Funciona exatamente como `method="GET"` e `action=""` (mesma página). Ao submeter com "MIC", URL vira `/?nome=MIC`.

## Variações práticas

### Busca (padrão Google)

```html
<form action="/search" method="GET">
  <input type="text" name="q" placeholder="Pesquisar..." />
  <button type="submit">Buscar</button>
</form>
<!-- URL resultante: /search?q=termo_buscado -->
```

### Login (POST para segurança)

```html
<form action="/login" method="POST">
  <input type="email" name="email" placeholder="E-mail" />
  <input type="password" name="senha" placeholder="Senha" />
  <button type="submit">Entrar</button>
</form>
<!-- Dados vão no body HTTP, não na URL -->
```

### Filtros múltiplos (GET com vários campos)

```html
<form action="/users" method="GET">
  <input type="text" name="id" placeholder="ID" />
  <input type="text" name="filtro" placeholder="Filtro" />
  <input type="text" name="nome" placeholder="Nome" />
  <button type="submit">Filtrar</button>
</form>
<!-- URL: /users?id=123&filtro=ativo&nome=Mike -->
```

O instrutor mencionou este cenário: "se eu mandasse um campo de ID, se eu mandasse um campo de filtro, todos os campos iam estar sendo passados aqui pela URL".

### Formulário para endpoint específico

```html
<form action="/user" method="GET">
  <input type="text" name="nome" />
  <button type="submit">Enviar</button>
</form>
<!-- URL: /user?nome=Mike -->
```

## Comparação visual GET vs POST

### GET — Dados visíveis

```
URL antes:  http://localhost:3000/
URL depois: http://localhost:3000/?nome=Mike
                                  ↑
                        Query string com os dados
```

### POST — Dados escondidos

```
URL antes:  http://localhost:3000/
URL depois: http://localhost:3000/
                                  ↑
                        Nada muda na URL
                        Dados estão no HTTP body (invisível no navegador)
```

## Input sem name (anti-pattern)

```html
<!-- ERRADO: input sem name não é enviado -->
<form action="/" method="GET">
  <input type="text" />
  <button type="submit">Enviar</button>
</form>
<!-- URL após submit: /? (nenhum dado) -->

<!-- CORRETO: input com name é enviado -->
<form action="/" method="GET">
  <input type="text" name="busca" />
  <button type="submit">Enviar</button>
</form>
<!-- URL após submit: /?busca=valor -->
```