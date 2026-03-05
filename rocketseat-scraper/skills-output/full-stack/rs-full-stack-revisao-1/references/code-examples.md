# Code Examples: HTML Forms

## Formulário completo de cadastro

```html
<form action="/register" method="POST">
  <fieldset>
    <legend>Informações Pessoais</legend>

    <label for="fullname">Nome Completo</label>
    <input type="text" name="fullname" id="fullname" required>

    <label for="email">E-mail</label>
    <input type="email" name="email" id="email" required>

    <label for="password">Senha</label>
    <input type="password" name="password" id="password" required>
  </fieldset>

  <fieldset>
    <legend>Preferências</legend>

    <label for="color">Cor favorita</label>
    <input type="color" name="color" id="color">

    <label for="bio">Sobre você</label>
    <textarea name="bio" id="bio" rows="4" cols="50"></textarea>
  </fieldset>

  <button type="submit">Cadastrar</button>
  <button type="reset">Limpar</button>
</form>
```

## Formulário com todos os tipos de input da aula

```html
<form action="/demo" method="POST">
  <!-- text -->
  <label for="name">Nome</label>
  <input type="text" name="name" id="name">

  <!-- number -->
  <label for="age">Idade</label>
  <input type="number" name="age" id="age" min="0" max="150">

  <!-- email -->
  <label for="email">E-mail</label>
  <input type="email" name="email" id="email">

  <!-- password -->
  <label for="pass">Senha</label>
  <input type="password" name="pass" id="pass">

  <!-- file -->
  <label for="avatar">Foto</label>
  <input type="file" name="avatar" id="avatar">

  <!-- range -->
  <label for="volume">Volume</label>
  <input type="range" name="volume" id="volume" min="0" max="100">

  <!-- color -->
  <label for="theme">Cor do tema</label>
  <input type="color" name="theme" id="theme">

  <!-- checkbox -->
  <fieldset>
    <legend>Interesses</legend>
    <label><input type="checkbox" name="interests" value="html"> HTML</label>
    <label><input type="checkbox" name="interests" value="css"> CSS</label>
    <label><input type="checkbox" name="interests" value="js"> JavaScript</label>
  </fieldset>

  <!-- radio -->
  <fieldset>
    <legend>Nível</legend>
    <label><input type="radio" name="level" value="beginner"> Iniciante</label>
    <label><input type="radio" name="level" value="intermediate"> Intermediário</label>
    <label><input type="radio" name="level" value="advanced"> Avançado</label>
  </fieldset>

  <!-- hidden -->
  <input type="hidden" name="source" value="landing-page">

  <button type="submit">Enviar</button>
</form>
```

## Select simples, múltiplo e agrupado

```html
<!-- Simples -->
<label for="country">País</label>
<select name="country" id="country">
  <option value="">Selecione...</option>
  <option value="br">Brasil</option>
  <option value="us">Estados Unidos</option>
  <option value="pt">Portugal</option>
</select>

<!-- Múltiplo -->
<label for="languages">Linguagens (segure Ctrl para múltipla seleção)</label>
<select name="languages" id="languages" multiple>
  <option value="js">JavaScript</option>
  <option value="py">Python</option>
  <option value="rb">Ruby</option>
  <option value="go">Go</option>
</select>

<!-- Agrupado -->
<label for="car">Carro</label>
<select name="car" id="car">
  <optgroup label="Populares">
    <option value="gol">VW Gol</option>
    <option value="onix">Chevrolet Onix</option>
    <option value="hb20">Hyundai HB20</option>
  </optgroup>
  <optgroup label="SUVs">
    <option value="tracker">Chevrolet Tracker</option>
    <option value="creta">Hyundai Creta</option>
  </optgroup>
</select>
```

## Dados na URL (GET) vs escondidos (POST)

```html
<!-- GET: dados ficam visíveis na URL -->
<!-- Resultado: /search?q=html+forms -->
<form action="/search" method="GET">
  <label for="q">Buscar</label>
  <input type="text" name="q" id="q">
  <button type="submit">Buscar</button>
</form>

<!-- POST: dados vão no body da requisição -->
<!-- URL fica limpa: /login -->
<form action="/login" method="POST">
  <label for="user">Usuário</label>
  <input type="text" name="user" id="user">

  <label for="pass">Senha</label>
  <input type="password" name="pass" id="pass">

  <button type="submit">Entrar</button>
</form>
```

## Formulário de contato com textarea

```html
<form action="/contact" method="POST">
  <fieldset>
    <legend>Fale Conosco</legend>

    <label for="name">Nome</label>
    <input type="text" name="name" id="name" required>

    <label for="email">E-mail</label>
    <input type="email" name="email" id="email" required>

    <label for="subject">Assunto</label>
    <select name="subject" id="subject">
      <option value="">Selecione...</option>
      <option value="support">Suporte</option>
      <option value="feedback">Feedback</option>
      <option value="partnership">Parceria</option>
    </select>

    <label for="message">Mensagem</label>
    <textarea name="message" id="message" rows="6" cols="50" required></textarea>
  </fieldset>

  <button type="submit">Enviar Mensagem</button>
</form>
```

## Três tipos de botão

```html
<form action="/example" method="POST">
  <label for="data">Dado</label>
  <input type="text" name="data" id="data">

  <!-- submit: envia o formulário -->
  <button type="submit">Enviar</button>

  <!-- reset: limpa todos os campos -->
  <button type="reset">Limpar</button>

  <!-- button: sem ação padrão, precisa de JavaScript -->
  <button type="button" onclick="alert('Clicou!')">Apenas um Botão</button>
</form>
```