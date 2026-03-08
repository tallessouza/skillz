---
name: rs-full-stack-conhecendo-o-projeto-2025
description: "Configures implementation of a currency converter project with JavaScript. Use when user asks to 'build a currency converter', 'create exchange rate app', 'implement money conversion', or 'add JS to HTML/CSS project'. Covers input validation for integers only, currency selection, and conversion display. Make sure to use this skill whenever building financial conversion interfaces or adding JS functionality to existing HTML/CSS. Not for backend APIs, real-time exchange rates, or payment processing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-projects
  tags: [javascript, currency-converter, input-validation, dom-manipulation]
---

# Projeto Conversor de Moedas

> Implementar JavaScript em um projeto HTML/CSS existente, adicionando conversao de moedas, selecao de moedas e validacao de input para aceitar apenas numeros inteiros.

## Key concepts

O projeto e um conversor de moedas (cambio) que recebe um valor inteiro, permite selecionar uma moeda (dolar, euro, libra) e exibe o resultado da conversao em reais. O HTML e CSS ja existem — o foco e adicionar comportamento com JavaScript puro.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Campo de input numerico | Validacao que bloqueia letras, virgulas e pontos — apenas inteiros |
| Lista de moedas | Select com opcoes e simbolos correspondentes (USD $, EUR €, GBP £) |
| Botao de conversao | Evento click que calcula valor * taxa e exibe resultado formatado |
| Exibicao de resultado | Mostrar simbolo da moeda, taxa unitaria e valor total convertido |

## Funcionalidades a implementar

### 1. Conversao de moedas
- Multiplicar quantidade pela taxa de cambio da moeda selecionada
- Exibir resultado em reais com centavos

### 2. Selecao de moedas
- Dolar americano (USD)
- Euro (EUR)
- Libra esterlina (GBP)
- Extensivel para novas moedas

### 3. Validacao do campo de entrada
- Aceitar apenas numeros inteiros
- Bloquear letras, virgulas e pontos
- Requisito de negocio: casas de cambio trabalham com valores cheios

## Estrutura do projeto

```
projeto/
├── index.html    # Estrutura pronta (download)
├── style.css     # Estilizacao pronta (download)
└── script.js     # A implementar do zero
```

## Heuristics

| Situacao | Fazer |
|----------|-------|
| Input financeiro sem centavos | Validar para aceitar apenas parseInt, bloquear caracteres nao-numericos |
| Taxas de cambio | Usar valores estaticos como constantes (facil de atualizar depois) |
| Simbolo da moeda no resultado | Trocar dinamicamente conforme selecao ($ / € / £) |
| Projeto para portfolio | Adicionar novas moedas e funcionalidades alem do basico |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Preciso de API para taxas | Para aprender JS, valores estaticos sao suficientes |
| Input type=number resolve validacao | Ainda permite pontos/virgulas em alguns browsers — validacao JS e necessaria |
| Preciso fazer HTML/CSS primeiro | O projeto fornece HTML/CSS prontos — foco total em JavaScript |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Input aceita letras mesmo com validacao | Evento errado ou validacao nao aplicada ao `input` event | Use `event.target.value.replace(/\D/g, '')` no evento `input` |
| Resultado da conversao mostra NaN | Valor do input nao convertido para numero | Use `parseInt(inputValue)` antes de multiplicar pela taxa |
| Select nao muda a moeda na conversao | Valor do select nao lido corretamente | Use `select.value` dentro do handler do botao de conversao |
| Simbolo da moeda nao atualiza | Mapeamento moeda→simbolo ausente ou incorreto | Crie um objeto `{ USD: '$', EUR: '€', GBP: '£' }` e acesse pela chave |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre decisoes de projeto e requisitos de negocio
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo e padroes de implementacao