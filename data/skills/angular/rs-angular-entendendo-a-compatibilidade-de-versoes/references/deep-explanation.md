# Deep Explanation: Compatibilidade de Versoes Angular

## Por que isso importa

O Angular CLI nao e um programa standalone — ele depende do Node.js como runtime. Quando voce executa `ng serve`, `ng build`, ou qualquer comando do CLI, por baixo dos panos o Node.js esta executando essas operacoes. Cada versao do Angular CLI usa funcionalidades especificas do Node.js que podem nao existir em versoes mais antigas.

## A analogia do instrutor

O instrutor enfatiza que esse e um dos pontos que "da uns erros bem chatinhos" — erros de compatibilidade que aparecem na hora de executar comandos como `ng serve` ou `ng build`, e que sao dificeis de diagnosticar porque a mensagem de erro nao diz claramente "sua versao do Node e incompativel". Voce perde tempo procurando a solucao em outros lugares quando o problema e simplesmente a versao errada do Node.

## A cadeia de dependencia

```
Angular CLI (versao X)
    └── depende de → Node.js (versao Y)
                         └── ja inclui → NPM (versao Z)
```

- **Angular CLI → Node.js**: dependencia critica, precisa verificar manualmente
- **Node.js → NPM**: automatico, NPM vem junto com o Node

## Fluxo mental correto

1. "Vou criar um projeto Angular na versao X"
2. "Qual versao do Node e compativel com Angular X?"
3. Consultar `angular.dev/reference/versions`
4. Verificar `node -v` na maquina
5. Se incompativel → desinstalar Node atual → instalar versao compativel
6. Criar o projeto

## A tabela oficial

A tabela em `angular.dev/reference/versions` tambem inclui compatibilidade com TypeScript e RxJS, que podem ser uteis para projetos mais avancados. Mas o ponto critico e Node.js — se o Node estiver errado, nada funciona.

## Dica do instrutor

Salvar a pagina `angular.dev/reference/versions` nos favoritos. E uma referencia que voce vai consultar toda vez que criar um novo projeto ou atualizar versao do Angular.

## Quando usar NVM

O instrutor nao menciona NVM (Node Version Manager) diretamente, mas a recomendacao de "desinstalar e instalar" sugere que usar NVM e a abordagem ideal para alternar entre versoes do Node conforme o projeto Angular que esta trabalhando:

```bash
nvm install 22
nvm use 22
ng new meu-projeto
```