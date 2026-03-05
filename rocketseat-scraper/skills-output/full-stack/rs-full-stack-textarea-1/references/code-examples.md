# Code Examples: Textarea em Formularios HTML

## Exemplo 1: Textarea minimo funcional

```html
<form>
  <textarea name="texto"></textarea>
  <button type="submit">Enviar</button>
</form>
```

O formulario mais simples possivel com textarea. Note: `name="texto"` e obrigatorio para o valor ser enviado.

## Exemplo 2: Erro de whitespace (do instrutor)

```html
<!-- ERRADO: espaco dentro da tag vira valor inicial -->
<textarea name="texto"> </textarea>
```

Resultado: o campo ja inicia com um espaco. O usuario ve o cursor apos o espaco.

```html
<!-- CORRETO: tags coladas -->
<textarea name="texto"></textarea>
```

## Exemplo 3: Limitacao de caracteres

```html
<!-- Maximo 10 caracteres — o navegador bloqueia apos o 10o -->
<textarea name="texto" maxlength="10"></textarea>
```

```html
<!-- Minimo 5 caracteres — validacao no submit -->
<textarea name="texto" minlength="5"></textarea>
```

```html
<!-- Combinando ambos -->
<textarea name="bio" minlength="10" maxlength="500"></textarea>
```

## Exemplo 4: wrap="off" (demonstrado pelo instrutor)

```html
<!-- Desativa quebra de linha visual — texto rola horizontalmente -->
<textarea name="texto" wrap="off"></textarea>
```

Versus o padrao (sem wrap ou `wrap="soft"`):

```html
<!-- Quebra de linha visual normal -->
<textarea name="texto"></textarea>
```

## Exemplo 5: Com placeholder e required

```html
<textarea
  name="mensagem"
  placeholder="Digite seu texto"
  required
></textarea>
```

## Exemplo 6: Dimensionamento via CSS (recomendado)

```html
<textarea name="descricao" placeholder="Descreva o produto"></textarea>
```

```css
textarea[name="descricao"] {
  width: 100%;
  height: 200px;
  min-height: 100px;
  max-height: 400px;
  resize: vertical;
  padding: 8px;
  font-family: inherit;
  font-size: 1rem;
}
```

## Exemplo 7: Comparacao rows/cols vs CSS

```html
<!-- NAO RECOMENDADO -->
<textarea name="msg" rows="5" cols="40"></textarea>

<!-- RECOMENDADO -->
<textarea name="msg"></textarea>
<style>
  textarea[name="msg"] {
    width: 320px;
    height: 100px;
  }
</style>
```

## Exemplo 8: Formulario completo com textarea

```html
<form action="/api/feedback" method="POST">
  <label for="feedback">Seu feedback:</label>
  <textarea
    id="feedback"
    name="feedback"
    minlength="20"
    maxlength="2000"
    placeholder="Conte sua experiencia..."
    required
  ></textarea>
  <button type="submit">Enviar</button>
</form>
```

```css
textarea#feedback {
  display: block;
  width: 100%;
  height: 150px;
  resize: vertical;
  margin-top: 4px;
  padding: 8px;
  font-family: inherit;
}
```

## Exemplo 9: Textarea com valor default (sem whitespace)

```html
<!-- Valor default correto -->
<textarea name="template">Prezado(a),

Segue em anexo...</textarea>
```

Note que o conteudo comeca imediatamente apos `>` e termina imediatamente antes de `</textarea>`. Qualquer espaco extra sera incluido no valor.