# Code Examples: Criando e Estilizando Mensagens de Erro dos Inputs

## Exemplo 1: HTML completo do input com erro

```html
<div class="custom-input-group">
  <label for="fullName">Nome completo</label>
  <input
    type="text"
    id="fullName"
    class="form-control"
    placeholder="Digite seu nome"
  />

  <!-- Renderizar condicionalmente com *ngIf ou @if -->
  <div class="errorMessage d-flex align-items-center">
    <i class="ph ph-warning-circle"></i>
    <p class="m-0">Campo obrigatorio</p>
  </div>
</div>
```

## Exemplo 2: CSS completo

```css
/* Container do erro */
.errorMessage {
  gap: 4px;
  margin-top: 8px;
  color: #dc3545;
}

/* Tipografia do texto de erro */
.errorMessage p {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  vertical-align: middle;
}

/* Label fica vermelho quando erro existe no DOM */
.custom-input-group:has(.errorMessage) label {
  color: #dc3545;
}
```

## Exemplo 3: Com renderizacao condicional Angular (moderno)

```html
<div class="custom-input-group">
  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    class="form-control"
    formControlName="email"
  />

  @if (form.get('email')?.invalid && form.get('email')?.touched) {
    <div class="errorMessage d-flex align-items-center">
      <i class="ph ph-warning-circle"></i>
      <p class="m-0">Informe um email valido</p>
    </div>
  }
</div>
```

## Exemplo 4: Com *ngIf (sintaxe classica)

```html
<div class="custom-input-group">
  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    class="form-control"
    formControlName="email"
  />

  <div
    *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
    class="errorMessage d-flex align-items-center"
  >
    <i class="ph ph-warning-circle"></i>
    <p class="m-0">Informe um email valido</p>
  </div>
</div>
```

## Exemplo 5: Multiplos inputs com erro independente

```html
<form [formGroup]="form">
  <div class="custom-input-group">
    <label for="name">Nome</label>
    <input type="text" id="name" class="form-control" formControlName="name" />
    @if (form.get('name')?.invalid && form.get('name')?.touched) {
      <div class="errorMessage d-flex align-items-center">
        <i class="ph ph-warning-circle"></i>
        <p class="m-0">Nome e obrigatorio</p>
      </div>
    }
  </div>

  <div class="custom-input-group">
    <label for="email">Email</label>
    <input type="email" id="email" class="form-control" formControlName="email" />
    @if (form.get('email')?.invalid && form.get('email')?.touched) {
      <div class="errorMessage d-flex align-items-center">
        <i class="ph ph-warning-circle"></i>
        <p class="m-0">Email invalido</p>
      </div>
    }
  </div>
</form>
```

## Exemplo 6: Demonstracao do comportamento CSS dinamico

```html
<!-- SEM erro: label usa cor padrao -->
<div class="custom-input-group">
  <label>Nome completo</label>  <!-- cor: padrao -->
  <input type="text" class="form-control" />
  <!-- sem div .errorMessage = CSS :has() nao ativa -->
</div>

<!-- COM erro: label fica vermelho automaticamente -->
<div class="custom-input-group">
  <label>Nome completo</label>  <!-- cor: #dc3545 (automatico via CSS) -->
  <input type="text" class="form-control" />
  <div class="errorMessage d-flex align-items-center">
    <i class="ph ph-warning-circle"></i>
    <p class="m-0">Campo obrigatorio</p>
  </div>
</div>
```