# Code Examples: Estilizando Estado Focus dos Inputs

## Estrutura HTML completa do componente

```html
<!-- certificate-form.component.html -->
<div class="custom-input-group">
  <label for="nome">Nome do Aluno</label>
  <input
    id="nome"
    type="text"
    class="form-control custom-input"
  />
</div>

<div class="custom-input-group">
  <label for="atividade">Atividade</label>
  <input
    id="atividade"
    type="text"
    class="form-control custom-input"
  />
</div>
```

## CSS completo do componente

```css
/* certificate-form.component.css */

/* Estado default do input */
.custom-input {
  /* estilos base definidos em aula anterior */
}

/* Estado focus — borda customizada + remove sombra Bootstrap */
.custom-input:focus {
  border: 1px solid #4F46E5;
  box-shadow: none;
}

/* Label muda de cor quando input irmao esta focado */
.custom-input-group:has(input:focus) label {
  color: #4F46E5;
}
```

## Evolucao passo a passo

### Passo 1: Adicionar borda no focus

```css
.custom-input:focus {
  border: 1px solid #4F46E5;
}
```

**Resultado:** borda azul aparece, mas sombra do Bootstrap tambem permanece (borda dupla).

### Passo 2: Remover sombra do Bootstrap

```css
.custom-input:focus {
  border: 1px solid #4F46E5;
  box-shadow: none;
}
```

**Resultado:** apenas a borda azul, sem sombra extra.

### Passo 3: Tentativa com div generica (errado)

```css
div:has(input:focus) label {
  color: #4F46E5;
}
```

**Resultado:** TODOS os labels ficam azuis quando qualquer input recebe focus.

### Passo 4: Escopo correto com classe custom

```html
<div class="custom-input-group">
  <label for="nome">Nome</label>
  <input id="nome" class="form-control custom-input" />
</div>
```

```css
.custom-input-group:has(input:focus) label {
  color: #4F46E5;
}
```

**Resultado:** apenas o label do campo focado muda de cor.

### Passo 5: Associacao for/id para acessibilidade

```html
<label for="nome">Nome do Aluno</label>
<input id="nome" type="text" class="form-control custom-input" />
```

**Resultado:** clicar no label "Nome do Aluno" automaticamente foca o input.

## Variacao: multiplos campos com escopo correto

```html
<div class="custom-input-group">
  <label for="nome">Nome do Aluno</label>
  <input id="nome" type="text" class="form-control custom-input" />
</div>

<div class="custom-input-group">
  <label for="atividade">Atividade</label>
  <input id="atividade" type="text" class="form-control custom-input" />
</div>

<div class="custom-input-group">
  <label for="carga-horaria">Carga Horária</label>
  <input id="carga-horaria" type="text" class="form-control custom-input" />
</div>
```

Cada `.custom-input-group` isola o comportamento do `:has()` — focar "Nome" so estiliza o label "Nome".