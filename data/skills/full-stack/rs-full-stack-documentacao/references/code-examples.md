# Code Examples: Documentacao

## Estrategias praticas de busca

### Busca no MDN via Google

```
Pesquisa: "MDN background CSS"
→ Resultado: https://developer.mozilla.org/pt-BR/docs/Web/CSS/background

Pesquisa: "MDN addEventListener"
→ Resultado: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

Pesquisa: "MDN flexbox"
→ Resultado: https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_flexible_box_layout
```

### Padrao de busca

```
MDN + [termo exato da propriedade/metodo/elemento]

Exemplos:
  MDN border-radius
  MDN fetch API
  MDN Array.map
  MDN input element
  MDN media queries
```

### Busca no DevDocs

```
1. Abra devdocs.io
2. Clique na barra de busca (ou pressione /)
3. Digite o termo: "background"
4. Observe os badges:
   - [CSS] background        ← propriedade CSS
   - [React Native] background ← estilo React Native
   - [Electron] background    ← processo background
5. Clique no resultado com o badge correto
```

## Configuracao recomendada do DevDocs

### Tecnologias para habilitar no inicio (curso full-stack)

```
Vá em devdocs.io → clique no icone de engrenagem → Enable:

Essenciais:
  ☑ CSS
  ☑ HTML
  ☑ JavaScript
  ☑ DOM

Conforme avanca no curso:
  ☑ Node.js
  ☑ React (quando chegar em frameworks)
  ☑ TypeScript (quando chegar em tipagem)
```

### Instalacao offline

```
1. devdocs.io → icone offline (canto inferior)
2. Selecione as tecnologias que quer offline
3. Clique "Install"
4. Funciona sem internet apos instalacao
```

## Fluxo de consulta recomendado

```
Duvida sobre propriedade/metodo web
         │
         ├─ Sabe o termo exato? ──→ Google: "MDN {termo}"
         │
         └─ Nao sabe o termo? ──→ DevDocs: busca por keyword
                                      │
                                      ├─ Achou com badge correto? → Le a doc
                                      │
                                      └─ Muitos resultados? → Filtre tecnologias ativas
```