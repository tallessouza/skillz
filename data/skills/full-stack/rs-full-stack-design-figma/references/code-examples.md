# Code Examples: Design - Figma

## Contexto

Esta aula é sobre configuração de ferramenta (Figma), não sobre código. Os exemplos aqui focam em como **extrair informações do Figma para código**.

## Exemplo 1: Extraindo cores do Figma para CSS

Ao inspecionar um elemento no Figma, você encontra as propriedades visuais. Exemplo de tradução:

```css
/* Valores extraídos do Figma */
:root {
  --color-primary: #8257E5;
  --color-background: #121214;
  --color-text: #E1E1E6;
  --font-size-title: 2rem;
  --spacing-md: 1.5rem;
}
```

## Exemplo 2: Traduzindo um card do Figma para HTML/CSS

Ao ver um card no design do Figma:

```html
<div class="card">
  <img src="thumbnail.jpg" alt="Projeto" class="card-image" />
  <div class="card-content">
    <h3 class="card-title">Nome do Projeto</h3>
    <p class="card-description">Descrição breve</p>
  </div>
</div>
```

```css
.card {
  background: #202024;
  border-radius: 8px;       /* extraído do Figma: corner radius */
  overflow: hidden;
  padding: 0;
}

.card-image {
  width: 100%;
  height: 180px;            /* extraído do Figma: altura da imagem */
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;          /* extraído do Figma: padding interno */
}

.card-title {
  font-size: 1.25rem;       /* extraído do Figma: font size */
  color: #E1E1E6;           /* extraído do Figma: fill color */
  margin-bottom: 0.5rem;
}
```

## Exemplo 3: Usando Figma Dev Mode (referência futura)

Em aulas futuras, o Figma Dev Mode permite copiar CSS diretamente:

```css
/* CSS gerado pelo Figma Dev Mode */
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 24px;
gap: 16px;
width: 320px;
background: #202024;
border-radius: 8px;
```

## Dica: Estrutura de pastas no Figma

Para organizar seus projetos duplicados:

```
Seus Arquivos/
├── Skillz/
│   ├── Projeto 1 (copy)
│   ├── Projeto 2 (copy)
│   └── Projeto 3 (copy)
└── Pessoal/
    └── Meus designs
```