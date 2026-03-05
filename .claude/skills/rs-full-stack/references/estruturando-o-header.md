---
name: rs-full-stack-estruturando-o-header
description: "Applies semantic HTML structuring patterns when building page headers and profile sections. Use when user asks to 'create a header', 'build a profile section', 'structure HTML layout', or 'create an about section'. Enforces container patterns, semantic list usage for metadata, and progressive layout thinking. Make sure to use this skill whenever generating HTML for headers or profile-based layouts. Not for CSS styling, JavaScript logic, or backend code."
---

# Estruturando o Header

> Pense na estrutura visual primeiro, identifique os blocos, depois traduza em HTML semantico com containers e agrupamentos claros.

## Rules

1. **Use container divs para controlar largura e espacamento** — `.container` dentro do `<header>` para manter margens laterais consistentes, porque o layout precisa de limites visuais
2. **Agrupe elementos relacionados em divs semanticas** — `.profile` para foto+nome+descricao, `.info` para metadados, porque facilita o Flexbox depois
3. **Use listas para conjuntos de metadados repetitivos** — `<ul>` com `<li>` ao inves de divs soltas para itens como localizacao/viagens/fotos, porque listas comunicam agrupamento semantico
4. **Cada item de lista segue o padrao icone + span** — `<img>` do icone seguido de `<span>` com o texto, porque permite estilizacao independente
5. **Reaproveite wrappers existentes** — se ja existe uma div de background-color, estenda ela ao inves de criar outra, porque reduz divs desnecessarias
6. **Aceite que a estrutura vai mudar** — a primeira versao do HTML raramente e a final; construa, depois ajuste conforme o CSS exige

## How to write

### Header com profile e info

```html
<header>
  <div class="bg-surface-color">
    <div class="container">
      <div class="profile">
        <img src="./assets/profile-pic.jpg" alt="Imagem de Isabela Torres" />
        <div>
          <h1>Isabela Torres</h1>
          <p>Descricao do perfil aqui.</p>
        </div>
      </div>

      <div class="info">
        <ul>
          <li>
            <img src="./assets/icons/map-pin.svg" alt="Icone de mapa" />
            <span>Sao Paulo, Brasil</span>
          </li>
          <li>
            <img src="./assets/icons/airplane.svg" alt="Icone de aviao" />
            <span>37 paises</span>
          </li>
          <li>
            <img src="./assets/icons/image.svg" alt="Icone de imagem" />
            <span>240 fotos</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</header>
```

## Example

**Before (divs genericas sem semantica):**
```html
<div>
  <div>
    <img src="foto.jpg" />
    <div>Nome</div>
    <div>Descricao</div>
  </div>
  <div>
    <div><img src="icon1.svg" /> Texto 1</div>
    <div><img src="icon2.svg" /> Texto 2</div>
  </div>
</div>
```

**After (com estrutura semantica):**
```html
<header>
  <div class="container">
    <div class="profile">
      <img src="foto.jpg" alt="Foto de perfil" />
      <div>
        <h1>Nome</h1>
        <p>Descricao</p>
      </div>
    </div>
    <div class="info">
      <ul>
        <li><img src="icon1.svg" alt="Icone" /><span>Texto 1</span></li>
        <li><img src="icon2.svg" alt="Icone" /><span>Texto 2</span></li>
      </ul>
    </div>
  </div>
</header>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Grupo de 3+ itens com mesma estrutura | Use `<ul>` com `<li>` |
| Foto + nome + descricao | Agrupe em `.profile` com div interna para textos |
| Secao principal no topo | Use `<header>` semantico |
| Precisa de margens laterais | Envolva em `.container` |
| Background que cobre toda largura | Div wrapper fora do container |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<div>` para lista de metadados | `<ul><li>` para itens repetitivos |
| Texto solto ao lado de icone | `<span>` envolvendo o texto |
| `<img>` sem alt | `<img alt="descricao do icone">` |
| Div nova de background quando ja existe uma | Estenda a div existente |
| Tudo flat sem agrupamento | Divs nomeadas: `.profile`, `.info` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre pensar o layout antes de codar e aceitar iteracao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-estruturando-o-header/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-estruturando-o-header/references/code-examples.md)
