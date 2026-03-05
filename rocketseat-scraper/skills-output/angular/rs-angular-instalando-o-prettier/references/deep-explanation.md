# Deep Explanation: Configurando Prettier para Angular

## Por que Prettier padrao nao basta para Angular

O instrutor demonstra ao vivo o problema: ao colocar um `<h1>` dentro de um bloco `@if` e salvar, o Prettier padrao deixa o `h1` "colado" no `@if`, sem indentacao. Isso acontece porque o Prettier nao conhece nativamente a sintaxe de control flow do Angular (introduzida no Angular 17+).

A sintaxe `@if`, `@for`, `@switch` e especifica do Angular e nao faz parte do HTML padrao. O Prettier trata esses blocos como texto comum, sem entender que criam niveis de indentacao.

## O papel de cada pacote

### `prettier@3.1.0`
O formatador base. Essa versao especifica e compativel com o plugin Angular. Versoes diferentes podem ter breaking changes na API de plugins.

### `eslint-plugin-prettier@5.0.1`
Integra o Prettier com o ESLint, permitindo que as regras de formatacao do Prettier sejam aplicadas como regras do ESLint. Para Angular, isso e crucial porque o plugin entende a sintaxe de templates.

## Por que --save-dev

O instrutor enfatiza: "eu nao preciso dessa biblioteca aqui no pacote de producao do meu projeto". Formatacao e uma ferramenta de desenvolvimento. No build de producao, o codigo ja esta compilado e minificado — Prettier nao tem funcao ali.

## Configuracoes do VS Code

Duas configuracoes sao essenciais:
1. **Format On Save** — dispara a formatacao automaticamente ao salvar (Ctrl+S)
2. **Default Formatter** — define qual formatador sera usado (precisa ser Prettier, pois o VS Code pode ter outros instalados)

Sem ambas configuradas, o Prettier fica instalado mas inativo.

## Ordem de instalacao

O instrutor instala primeiro a extensao do VS Code, depois os pacotes npm. Isso e intencional: a extensao e o "motor" que executa a formatacao no editor, enquanto os pacotes npm fornecem as regras especificas do projeto.