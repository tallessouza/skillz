# Code Examples: Novos Inputs HTML

## Input type="date"

```html
<!-- Exemplo da aula: campo de nascimento -->
<form>
  <label for="birth">Nascimento:</label>
  <input type="date" id="birth" name="birth">
  <button type="submit">Enviar</button>
</form>
<!-- Renderiza um date picker nativo -->
<!-- Formato de envio: birth=2024-03-15 (YYYY-MM-DD) -->
<!-- Suporte: Chrome ✅ Edge ✅ Firefox ✅ Safari ✅ iOS ✅ -->
```

## Input type="week"

```html
<!-- Exemplo da aula: campo de semana -->
<form>
  <label for="semana">Semana:</label>
  <input type="week" id="semana" name="semana">
  <button type="submit">Enviar</button>
</form>
<!-- Renderiza seletor de semana no Chrome/Edge -->
<!-- Formato de envio: semana=2024-W11 -->
<!-- Suporte: Chrome ✅ Edge ✅ Firefox ✅ Safari ❌ iOS ❌ -->
```

## Input type="month"

```html
<form>
  <label for="mes">Mes:</label>
  <input type="month" id="mes" name="mes">
  <button type="submit">Enviar</button>
</form>
<!-- Formato de envio: mes=2024-03 -->
<!-- Suporte: Chrome ✅ Edge ✅ Firefox ✅ Safari ❌ iOS ❌ -->
```

## Input type="time"

```html
<form>
  <label for="horario">Horario:</label>
  <input type="time" id="horario" name="horario">
  <button type="submit">Enviar</button>
</form>
<!-- Formato de envio: horario=14:30 -->
<!-- Suporte: Chrome ✅ Edge ✅ Firefox ✅ Safari ✅ iOS ✅ -->
```

## Input type="datetime-local"

```html
<form>
  <label for="agendamento">Agendamento:</label>
  <input type="datetime-local" id="agendamento" name="agendamento">
  <button type="submit">Enviar</button>
</form>
<!-- Formato de envio: agendamento=2024-03-15T14:30 -->
<!-- Suporte: Chrome ✅ Edge ✅ Firefox ✅ Safari ✅ iOS ✅ -->
```

## Outros input types mencionados na aula

### type="search"
```html
<input type="search" name="busca" placeholder="Buscar...">
<!-- Visualmente similar a text, mas com botao de limpar em alguns navegadores -->
<!-- Suporte amplo -->
```

### type="tel"
```html
<input type="tel" name="telefone" placeholder="(11) 99999-9999">
<!-- Em mobile, abre teclado numerico -->
<!-- Nao valida formato automaticamente -->
<!-- Suporte amplo -->
```

### type="image"
```html
<input type="image" src="submit-button.png" alt="Enviar">
<!-- Funciona como submit, mas com imagem -->
<!-- Envia coordenadas x,y do clique -->
```

### type="reset"
```html
<input type="reset" value="Limpar formulario">
<!-- Reseta todos os campos do form para valores iniciais -->
```

## Formulario completo com tipos variados

```html
<form action="/cadastro" method="POST">
  <fieldset>
    <legend>Dados Pessoais</legend>
    
    <label for="nome">Nome:</label>
    <input type="text" id="nome" name="nome" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <label for="tel">Telefone:</label>
    <input type="tel" id="tel" name="telefone">
    
    <label for="nascimento">Nascimento:</label>
    <input type="date" id="nascimento" name="nascimento">
  </fieldset>
  
  <fieldset>
    <legend>Agendamento</legend>
    
    <!-- Usar date + time separados ao inves de week/month -->
    <!-- porque date e time tem suporte amplo -->
    <label for="data">Data:</label>
    <input type="date" id="data" name="data_agendamento">
    
    <label for="hora">Horario:</label>
    <input type="time" id="hora" name="hora_agendamento">
  </fieldset>
  
  <button type="submit">Cadastrar</button>
  <button type="reset">Limpar</button>
</form>
```

## Fallback pattern para week/month (quando necessario)

```html
<!-- Se PRECISA de week/month e precisa funcionar no Safari -->
<!-- Use selects como fallback -->
<label for="mes">Mes:</label>
<select id="mes" name="mes">
  <option value="">Selecione o mes</option>
  <option value="01">Janeiro</option>
  <option value="02">Fevereiro</option>
  <option value="03">Marco</option>
  <!-- ... -->
  <option value="12">Dezembro</option>
</select>

<label for="ano">Ano:</label>
<input type="number" id="ano" name="ano" min="2020" max="2030">
```