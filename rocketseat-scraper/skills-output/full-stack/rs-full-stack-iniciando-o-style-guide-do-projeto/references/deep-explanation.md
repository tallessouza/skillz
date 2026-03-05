# Deep Explanation: Style Guide com Variáveis CSS

## Por que :root e não html?

O instrutor explica que `:root` é uma pseudo-class que funciona como o `html`, mas com especificidade maior. Isso significa que qualquer variável declarada no `:root` vence conflitos de especificidade com declarações em `html`. Além disso, semanticamente, `:root` comunica a intenção de "escopo global" — tudo que está ali afeta o projeto inteiro. O instrutor usa o termo "Global" para descrever esse comportamento.

## A estratégia de variáveis

A analogia central do instrutor: você define uma variável em um lugar e usa em 20 lugares. Quando precisa mudar, altera apenas a definição. Isso é "muito bom" nas palavras dele. O fluxo mental é:

1. Style Guide do Figma define as cores com nomes semânticos
2. Você traduz cada cor para uma custom property no `:root`
3. Em todo o CSS, você referencia via `var(--nome-da-variavel)`
4. Mudança de marca/tema = mudar apenas o `:root`

## O truque da transparência hex

Este é o "detalhezinho específico" que o instrutor destaca. Quando o Figma mostra uma cor branca (#FFFFFF) mas com opacidade 56%, você não consegue ver isso diretamente no formato hex padrão. O truque:

1. No Figma, passe o mouse sobre o color picker
2. O formato hex padrão não mostra opacidade claramente
3. Clique no seletor de formato para alternar para HSLA ou RGBA
4. Ajuste a opacidade até chegar em 56% (ou o valor desejado)
5. Volte para hex — agora o valor terá 8 dígitos (ex: `#FFFFFF8F`)
6. Os dois últimos dígitos hex representam a opacidade

### Tabela de conversão opacidade → hex

| Opacidade | Sufixo Hex |
|-----------|-----------|
| 100% | FF |
| 90% | E6 |
| 80% | CC |
| 70% | B3 |
| 60% | 99 |
| 56% | 8F |
| 50% | 80 |
| 40% | 66 |
| 30% | 4D |
| 20% | 33 |
| 10% | 1A |
| 0% | 00 |

O instrutor nota que "não precisa ser exato" — se ficou 1.56 ou algo ligeiramente diferente, está OK para o propósito do projeto.

## Exportação de assets no Figma

O instrutor explica que a designer Ilana configurou o projeto para exportação em lote (Ctrl+Shift+E / Cmd+Shift+E). Porém, ele alerta: "em outros projetos talvez você vai precisar exportar um por um". O fluxo recomendado:

1. No Figma, selecione os assets marcados para export
2. Use o atalho de exportação em lote
3. Crie uma pasta `assets/` dentro do projeto
4. Salve tudo lá para uso posterior

## Nomenclatura de variáveis CSS

O instrutor enfatiza: "a gente desconsidera os espaços, a gente não coloca números, a gente coloca de uma maneira que fique entendível". As regras implícitas são:

- Kebab-case: `--brand-color`, `--text-color-secondary`
- Sem números soltos: não `--color1`, mas `--brand-color`
- Nome comunica uso: `--text-color-primary` diz onde usar
- Agrupamento por prefixo: `--text-color-*`, `--bg-color-*`, `--shape-*`

## Autocomplete do VS Code

O instrutor demonstra que ao digitar `--` seguido do início do nome no VS Code, o editor sugere as variáveis disponíveis e insere automaticamente a sintaxe `var(--nome)`. Isso acelera o desenvolvimento e reduz erros de digitação.

## Fluxo completo da aula

1. Abrir Style Guide no Figma
2. Exportar assets (Ctrl+Shift+E)
3. Criar pasta `assets/` no projeto
4. Definir variáveis de cor no `:root` do CSS
5. Aplicar variáveis no body (cor de texto e fundo)
6. Testar com Live Server
7. Commit: "initial style guide"