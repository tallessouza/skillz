# Code Examples: Responsividade de Formularios com Tailwind

## 1. Header com botoes responsivos

```tsx
// ANTES: botoes sempre ao lado do titulo
<div className="flex justify-between items-center">
  <div>
    <h1>Settings</h1>
    <p>Update your settings</p>
  </div>
  <div className="flex gap-2">
    <button>Cancel</button>
    <button>Save</button>
  </div>
</div>

// DEPOIS: botoes empilham abaixo no mobile
<div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
  <div>
    <h1>Settings</h1>
    <p>Update your settings</p>
  </div>
  <div className="flex gap-2">
    <button>Cancel</button>
    <button>Save</button>
  </div>
</div>
```

## 2. Form row com label + input

```tsx
// ANTES: grid fixo
<div className="grid grid-cols-form gap-3 items-start">
  <label htmlFor="email">Email address</label>
  <input id="email" type="email" />
</div>

// DEPOIS: flex-col no mobile, grid no desktop
<div className="flex flex-col gap-3 lg:grid lg:grid-cols-form lg:items-start">
  <label htmlFor="email">Email address</label>
  <input id="email" type="email" />
</div>
```

## 3. Campos first name / last name com label acessivel

```tsx
// First name - label sempre visivel
<div className="flex flex-col gap-3 lg:grid lg:grid-cols-form lg:items-start">
  <label htmlFor="firstName">Name</label>
  <div className="flex flex-col gap-3 lg:block">
    <input id="firstName" />
    {/* Label visivel no mobile, sr-only no desktop */}
    <div className="flex flex-col gap-3 lg:block">
      <label htmlFor="lastName" className="lg:sr-only">Last name</label>
      <input id="lastName" />
    </div>
  </div>
</div>
```

## 4. Secao de biografia com textarea e controles

```tsx
// ANTES: grid fixo
<div className="grid grid-cols-form gap-3">
  <label>Bio</label>
  <div className="space-y-3">
    <div>{/* editor toolbar */}</div>
    <textarea />
    <p>Write a short introduction.</p>
  </div>
</div>

// DEPOIS: responsivo
<div className="flex flex-col gap-3 lg:grid lg:grid-cols-form">
  <label>Bio</label>
  <div className="space-y-3">
    <div>{/* editor toolbar */}</div>
    <textarea />
    <p>Write a short introduction.</p>
  </div>
</div>
```

## 5. Select + input na mesma row

```tsx
// Role + timezone na mesma secao
<div className="flex flex-col gap-3 lg:grid lg:grid-cols-form lg:items-start">
  <label>Role</label>
  <div className="flex flex-col gap-3 lg:flex-row">
    <select>{/* options */}</select>
    <select>{/* timezone options */}</select>
  </div>
</div>
```

## 6. Portfolio/file upload section

```tsx
<div className="flex flex-col gap-3 lg:grid lg:grid-cols-form lg:items-start">
  <label>Portfolio projects</label>
  <div>
    {/* file upload area */}
  </div>
</div>
```

## Padrao universal extraido

Toda secao de formulario segue este template:

```tsx
<div className="flex flex-col gap-3 lg:grid lg:grid-cols-form lg:items-start">
  <label htmlFor="fieldId">Field Label</label>
  <div>{/* field content */}</div>
</div>
```

As unicas variacoes sao:
- `lg:items-start` vs `lg:items-center` (depende do alinhamento desejado)
- Conteudo interno pode ter seu proprio `flex flex-col lg:flex-row`