---
name: rs-full-stack-estrutura-inicial-formulario
description: "Enforces proper HTML form structure with fieldset, label-input pairing, and semantic wrappers when writing forms. Use when user asks to 'create a form', 'build a registration form', 'add form fields', 'write HTML form', or 'structure a form'. Applies rules: wrapper divs per field, label-for linked to input-id, name attribute on every field, enctype for file uploads, semantic fieldset+legend grouping. Make sure to use this skill whenever generating HTML forms. Not for form validation, form submission logic, or CSS styling."
---

# Estrutura Inicial de Formulários HTML

> Todo campo de formulário vive dentro de um wrapper, tem label ligado por for/id, e name obrigatório para envio.

## Rules

1. **Sempre use wrapper por campo** — cada par label+input vive dentro de uma `div` com classe descritiva (`input-wrapper`, `select-wrapper`, `textarea-wrapper`), porque facilita estilização e manutenção posterior
2. **Agrupe campos relacionados com fieldset+legend** — fieldsets criam blocos semânticos (`informações da criança`, `informações do responsável`), porque dá significado estrutural ao formulário
3. **Ligue label ao input via for/id** — `label for="fullName"` + `input id="fullName"`, porque clicar no label seleciona o campo, melhorando acessibilidade
4. **name é obrigatório em todo campo** — o envio do formulário usa `name`, não `id`, porque sem name o dado não é transmitido ao servidor
5. **input type="file" exige enctype** — formulários com upload precisam de `enctype="multipart/form-data"` e `method="post"`, porque sem isso o arquivo não é enviado corretamente
6. **Use placeholders descritivos** — placeholders orientam o usuário sobre o que preencher (`Qual o nome da criança?`), porque reduzem dúvidas no preenchimento

## How to write

### Estrutura base do formulário

```html
<form action="" method="post" enctype="multipart/form-data">
  <fieldset>
    <legend>Informações da Criança</legend>
    <!-- campos aqui -->
  </fieldset>
</form>
```

### Campo de texto com wrapper

```html
<div class="input-wrapper">
  <label for="fullName">Nome completo</label>
  <input type="text" id="fullName" name="fullName"
    placeholder="Qual o nome da criança?" />
</div>
```

### Campo de data

```html
<div class="input-wrapper">
  <label for="birth">Data de nascimento</label>
  <input type="date" id="birth" name="birth" lang="pt-BR" />
</div>
```

### Select com options

```html
<div class="select-wrapper">
  <label for="gender">Sexo</label>
  <select id="gender" name="gender">
    <option value="female">Feminino</option>
    <option value="male">Masculino</option>
    <option value="na">Prefiro não responder</option>
  </select>
</div>
```

### Textarea

```html
<div class="textarea-wrapper">
  <label for="medicalInfo">Informações médicas</label>
  <textarea id="medicalInfo" name="medicalInfo" cols="30" rows="10"
    placeholder="Se a criança possui alguma condição médica que a escola deve estar ciente, especifique"></textarea>
</div>
```

### Input file (upload)

```html
<div class="droparea-wrapper">
  <input type="file" id="birthFile" name="birthFile" />
  <img src="./assets/icons/cloud-upload.svg" alt="Upload" />
  <p>Clique aqui para<br />selecionar os arquivos</p>
</div>
```

## Example

**Before (sem estrutura):**
```html
<form>
  Nome: <input type="text">
  <select>
    <option>Feminino</option>
  </select>
  <textarea></textarea>
  <input type="file">
</form>
```

**After (com esta skill):**
```html
<form action="" method="post" enctype="multipart/form-data">
  <fieldset>
    <legend>Informações da Criança</legend>

    <div class="input-wrapper">
      <label for="fullName">Nome completo</label>
      <input type="text" id="fullName" name="fullName"
        placeholder="Qual o nome da criança?" />
    </div>

    <div class="input-wrapper">
      <label for="birth">Data de nascimento</label>
      <input type="date" id="birth" name="birth" lang="pt-BR" />
    </div>

    <div class="select-wrapper">
      <label for="gender">Sexo</label>
      <select id="gender" name="gender">
        <option value="female">Feminino</option>
        <option value="male">Masculino</option>
        <option value="na">Prefiro não responder</option>
      </select>
    </div>

    <div class="textarea-wrapper">
      <label for="medicalInfo">Informações médicas</label>
      <textarea id="medicalInfo" name="medicalInfo" cols="30" rows="10"
        placeholder="Condição médica relevante, especifique"></textarea>
    </div>

    <div class="droparea-wrapper">
      <input type="file" id="birthFile" name="birthFile" />
      <p>Clique aqui para<br />selecionar os arquivos</p>
    </div>
  </fieldset>
</form>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário com upload de arquivo | Adicione `enctype="multipart/form-data"` e `method="post"` |
| Múltiplos grupos de campos | Um `fieldset` + `legend` por grupo |
| Campo de data | Use `type="date"` com `lang="pt-BR"` para formato brasileiro |
| Opções fixas (sexo, estado, etc.) | Use `select` com `option`, não inputs de texto |
| Texto longo (observações, descrições) | Use `textarea` com `cols`/`rows` iniciais, refine via CSS |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `<input>` sem `name` | `<input name="fullName" />` |
| `<label>` sem `for` | `<label for="fieldId">` |
| `<input>` solto sem wrapper | `<div class="input-wrapper"><label>...<input>...</div>` |
| `<form>` com file input sem enctype | `<form enctype="multipart/form-data" method="post">` |
| Campos sem agrupamento semântico | `<fieldset><legend>Grupo</legend>...</fieldset>` |
| `<input type="text">` para datas | `<input type="date" lang="pt-BR">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre wrappers, ligação label-input, e enctype
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-estrutura-inicial-do-formulario/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-estrutura-inicial-do-formulario/references/code-examples.md)
