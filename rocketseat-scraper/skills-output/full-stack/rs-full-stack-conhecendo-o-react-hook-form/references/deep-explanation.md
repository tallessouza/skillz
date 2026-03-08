# Deep Explanation: React Hook Form — Gerenciamento de Formulários

## O problema que o React Hook Form resolve

Quando se trabalha com formulários maiores em React — formulários com vários inputs — a abordagem tradicional exige criar um `useState` para cada campo. Em um formulário de cadastro com nome, email, senha, telefone, endereço... isso significa 5, 6, 7 estados separados, cada um com seu setter, cada um sendo passado como `value` e `onChange` para o input correspondente.

O resultado é um componente inchado, com muito boilerplate, e que re-renderiza o formulário inteiro a cada tecla digitada em qualquer campo (porque cada `setState` dispara um re-render).

## A vantagem do React Hook Form

O React Hook Form elimina essa necessidade. Ele gerencia os dados do formulário internamente, sem criar estados React visíveis. A API é baseada em dois conceitos centrais:

1. **`register`** — conecta um input ao formulário. Ao fazer `{...register('name')}`, o hook injeta `ref`, `onChange`, `onBlur` e `name` no input. O dado é capturado via ref (uncontrolled), não via state (controlled).

2. **`handleSubmit`** — envolve a função de submissão. Quando o usuário submete o formulário, o React Hook Form coleta todos os dados registrados e passa como um objeto tipado para o callback.

## Por que uncontrolled por padrão?

O React Hook Form usa inputs uncontrolled (baseados em `ref`) por padrão. Isso significa que digitar em um campo **não causa re-render** do componente. Em formulários grandes, isso é uma vantagem de performance significativa comparado com a abordagem `useState`, que re-renderiza a cada keystroke.

## Instalação

O instrutor recomenda instalar uma versão específica para garantir compatibilidade:

```bash
npm i react-hook-form@7.53.2
```

A dica prática é: mantenha a aplicação rodando em um terminal e abra um segundo terminal para instalar dependências. Não é necessário parar o servidor de desenvolvimento.

## Quando usar

- Formulários com 3 ou mais campos
- Formulários que precisam de validação
- Formulários onde performance importa (muitos campos, re-renders custosos)
- Qualquer formulário onde criar `useState` para cada campo se torna repetitivo

## Quando NÃO usar

- Input isolado (ex: barra de busca com 1 campo) — `useState` é mais simples
- Formulários extremamente dinâmicos onde cada campo depende do valor de outros em tempo real (pode precisar de `watch` ou abordagem híbrida)