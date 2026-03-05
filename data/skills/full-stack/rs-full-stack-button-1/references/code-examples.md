# Code Examples: HTML Button

## Exemplo 1: Estrutura basica do formulario com botao

Formulario simples com campo de texto e botao submit:

```html
<form action="" method="GET">
  <input type="text" name="nome" />
  <button type="submit">Enviar</button>
</form>
```

Ao clicar "Enviar" com "Mike" no campo, a URL muda para: `?nome=Mike`

## Exemplo 2: Botao submit sem type explicito

```html
<form action="" method="GET">
  <input type="text" name="nome" />
  <button>Submit 1</button>
  <button>Submit 2</button>
</form>
```

Ambos os botoes submetem o formulario, porque o tipo padrao e `submit`. O instrutor demonstrou que tanto "Submit 1" quanto "Submit 2" enviam os dados.

## Exemplo 3: Botao reset para limpar campos

```html
<form action="" method="GET">
  <input type="text" name="nome" />
  <button type="reset">Limpar</button>
</form>
```

Ao digitar algo no campo e clicar "Limpar", o campo volta ao estado inicial vazio.

## Exemplo 4: Botao type="button" (sem envio)

```html
<form action="" method="GET">
  <input type="text" name="nome" />
  <button type="button">Acao</button>
</form>
```

Clicar nesse botao nao envia o formulario nem limpa campos. Ele existe para acoes JavaScript.

## Exemplo 5: Botao com name e value

```html
<form action="" method="GET">
  <input type="text" name="nome" />
  <button type="submit" name="botao1" value="valor do botao">Enviar</button>
</form>
```

Resultado na URL ao submeter com "Mike": `?nome=Mike&botao1=valor+do+botao`

O par name/value do botao e incluido nos dados do formulario.

## Exemplo 6: Autofocus no botao

```html
<button type="submit" autofocus>Enviar</button>
```

O botao recebe foco automaticamente ao carregar a pagina. Se o usuario pressionar Enter, o formulario e enviado.

## Exemplo 7: Botao desativado

```html
<button type="submit" disabled>Enviar</button>
```

O botao aparece desativado (cinza) e nao pode ser clicado. Requer JavaScript para ativar:

```javascript
// Ativar botao quando campo estiver preenchido
const input = document.querySelector('input[name="nome"]');
const botao = document.querySelector('button[type="submit"]');

input.addEventListener('input', () => {
  botao.disabled = input.value.trim() === '';
});
```

## Exemplo 8: Multiplos botoes submit com identificacao

Cenario real — formulario com duas acoes de submit diferentes:

```html
<form action="/pedido" method="POST">
  <input type="text" name="observacao" />
  <button type="submit" name="acao" value="aprovar">Aprovar</button>
  <button type="submit" name="acao" value="rejeitar">Rejeitar</button>
</form>
```

O backend recebe `acao=aprovar` ou `acao=rejeitar` dependendo de qual botao foi clicado.

## Exemplo 9: Formulario completo com todos os tipos

```html
<form action="/cadastro" method="POST">
  <label>
    Nome:
    <input type="text" name="nome" />
  </label>

  <label>
    Email:
    <input type="email" name="email" />
  </label>

  <button type="submit">Cadastrar</button>
  <button type="reset">Limpar Campos</button>
  <button type="button" onclick="window.history.back()">Voltar</button>
</form>
```

Tres botoes, tres comportamentos distintos:
- **Cadastrar**: envia o formulario
- **Limpar Campos**: reseta todos os inputs
- **Voltar**: executa JavaScript sem afetar o formulario