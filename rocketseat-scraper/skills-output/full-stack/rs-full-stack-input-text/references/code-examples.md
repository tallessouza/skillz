# Code Examples: Input Text — Atributos HTML

## 1. Atributos fundamentais (type + name)

```html
<!-- Minimo necessario para um input funcional em formulario -->
<form>
  <input type="text" name="nome" />
  <button type="submit">Enviar</button>
</form>
<!-- Resultado no envio: ?nome=valor_digitado -->
```

## 2. Atributo value — dado pre-preenchido

```html
<form>
  <input type="text" name="nome" value="Mike" />
  <button type="submit">Enviar</button>
</form>
<!-- Campo aparece com "Mike" ja escrito -->
<!-- Se submeter sem alterar: ?nome=Mike -->
<!-- Usuario precisa apagar para digitar outro valor -->
```

## 3. Atributo placeholder — dica visual

```html
<form>
  <input type="text" name="nome" placeholder="Coloque seu nome" />
  <button type="submit">Enviar</button>
</form>
<!-- Campo mostra "Coloque seu nome" em cinza -->
<!-- Se submeter sem digitar: ?nome= (VAZIO!) -->
<!-- Placeholder desaparece ao usuario comecar a digitar -->
```

## 4. Comparacao value vs placeholder lado a lado

```html
<form>
  <!-- Com value: dado real enviado -->
  <label>Com value:</label>
  <input type="text" name="campo1" value="Mike" />

  <!-- Com placeholder: apenas dica, nao envia -->
  <label>Com placeholder:</label>
  <input type="text" name="campo2" placeholder="Coloque seu nome" />

  <button type="submit">Enviar</button>
</form>
<!-- Envio sem alteracao: ?campo1=Mike&campo2= -->
```

## 5. Atributo autocomplete

```html
<input type="text" name="nome" autocomplete="name" />
<input type="text" name="email" autocomplete="email" />
<input type="text" name="senha" autocomplete="new-password" />
<input type="text" name="site" autocomplete="url" />
<!-- Navegador sugere valores do historico conforme o tipo -->
```

## 6. Atributo size

```html
<!-- Tamanho visual em caracteres (preferir CSS) -->
<input type="text" name="nome" size="10" />  <!-- campo pequeno -->
<input type="text" name="nome" size="50" />  <!-- campo grande -->

<!-- Forma recomendada via CSS -->
<input type="text" name="nome" style="width: 300px;" />
```

## 7. Atributo autofocus

```html
<form>
  <!-- Este campo recebe foco automatico ao carregar a pagina -->
  <input type="text" name="busca" autofocus />
  <input type="text" name="outro" />
  <button type="submit">Buscar</button>
</form>
<!-- Cursor ja aparece piscando no campo "busca" -->
```

## 8. Atributo disabled

```html
<form>
  <input type="text" name="nome" value="Mike" disabled />
  <button type="submit">Enviar</button>
</form>
<!-- Campo aparece acinzentado, nao clicavel -->
<!-- Dado NAO e enviado no submit: ?  (nome ausente) -->
```

## 9. Atributo readonly

```html
<form>
  <input type="text" name="nome" value="Mike" readonly />
  <button type="submit">Enviar</button>
</form>
<!-- Campo visivel com "Mike", mas nao editavel -->
<!-- Dado E enviado no submit: ?nome=Mike -->
<!-- Diferenca do disabled: readonly envia, disabled nao -->
```

## 10. Atributo form (input externo)

```html
<!-- Input FORA do form, linkado pelo atributo form -->
<form id="meu-form">
  <button type="submit">Submit</button>
</form>

<input type="text" name="nome" form="meu-form" />

<!-- Ao clicar Submit, o dado do input externo e enviado -->
<!-- Resultado: ?nome=valor_digitado -->
```

## 11. Atributo required

```html
<form>
  <input type="text" name="nome" required />
  <button type="submit">Enviar</button>
</form>
<!-- Se tentar enviar vazio: navegador mostra "Por favor, preencha este campo" -->
<!-- Formulario so e enviado quando campo tem conteudo -->
```

## 12. Combinacao completa de atributos

```html
<form id="cadastro">
  <input
    type="text"
    name="nome_completo"
    placeholder="Digite seu nome completo"
    autocomplete="name"
    required
    autofocus
  />

  <input
    type="text"
    name="cpf"
    value="123.456.789-00"
    readonly
  />

  <input
    type="text"
    name="codigo_legado"
    value="XYZ-2024"
    disabled
  />

  <button type="submit">Cadastrar</button>
</form>

<!-- Campo fora do form linkado -->
<input
  type="text"
  name="observacao"
  placeholder="Alguma observacao?"
  form="cadastro"
/>
```

## 13. Variacoes praticas

### Formulario de busca
```html
<form action="/busca" method="get">
  <input type="text" name="q" placeholder="Buscar..." autofocus required />
  <button type="submit">Buscar</button>
</form>
```

### Formulario de contato
```html
<form action="/contato" method="post">
  <input type="text" name="nome" placeholder="Seu nome" autocomplete="name" required />
  <input type="text" name="assunto" placeholder="Assunto" required />
  <button type="submit">Enviar</button>
</form>
```

### Campo de referencia (nao editavel)
```html
<form>
  <label>Numero do pedido:</label>
  <input type="text" name="pedido" value="PED-2024-001" readonly />

  <label>Seu comentario:</label>
  <input type="text" name="comentario" placeholder="Escreva aqui" required />

  <button type="submit">Enviar</button>
</form>
```