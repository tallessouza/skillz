# Code Examples: Trabalhando com Imagens no Angular

## Criacao do projeto (comando exato da aula)

```bash
npx @angular/cli@19.2.0 new tratando-assets --styles=css --ssr=false
```

## Estrutura apos criar o projeto

```
tratando-assets/
├── public/
│   └── favicon.ico
├── src/
│   └── app/
│       ├── app.component.ts
│       ├── app.component.html
│       └── app.component.css
└── angular.json
```

## Adicionando imagem ao projeto

Criar pasta `public/images/` e copiar a imagem para dentro:

```
public/
├── favicon.ico
└── images/
    └── rocketseat.png
```

## Referenciando no HTML (app.component.html)

```html
<img src="/images/rocketseat.png" alt="Logo Rocketseat" />
```

O Angular resolve `/images/rocketseat.png` automaticamente a partir de `public/`.

## Referenciando no CSS (app.component.css)

```css
.container {
  width: 200px;
  height: 200px;
  background-image: url("/images/rocketseat.png");
  background-size: contain;
  background-repeat: no-repeat;
}
```

Com o HTML correspondente:

```html
<div class="container"></div>
```

## Configuracao no angular.json (ja vem pronto)

```json
{
  "projects": {
    "tratando-assets": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ]
          }
        }
      }
    }
  }
}
```

Isso diz ao Angular: "copie tudo de `public/` para o bundle final".

## Gerando o bundle final

```bash
ng build
```

Resultado em `dist/`:

```
dist/
└── tratando-assets/
    └── browser/
        ├── index.html
        ├── main-HASH.js
        ├── styles-HASH.css
        └── images/
            └── rocketseat.png    ← copiada identica de public/
```

## Exemplo Base64 (NAO recomendado para uso inline)

```html
<!-- NAO FACA ISSO — apenas para ilustracao -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..." />
```

Problemas:
- ~33% maior que o arquivo original
- Viaja dentro do JavaScript, bloqueando carregamento paralelo
- Nao e cacheavel pelo navegador separadamente

## Forma correta vs incorreta — resumo

```html
<!-- ERRADO: caminho inclui public -->
<img src="public/images/rocketseat.png" />

<!-- ERRADO: sem barra inicial -->
<img src="images/rocketseat.png" />

<!-- ERRADO: Base64 chumbado -->
<img src="data:image/png;base64,..." />

<!-- CORRETO -->
<img src="/images/rocketseat.png" alt="Logo Rocketseat" />
```