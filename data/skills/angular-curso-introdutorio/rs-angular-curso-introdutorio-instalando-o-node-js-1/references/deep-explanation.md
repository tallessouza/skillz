# Deep Explanation: Instalando Node.js e Angular CLI

## Por que Node.js é prerequisito do Angular?

O Angular CLI (Command Line Interface) é uma ferramenta construida sobre Node.js. O `npm` (Node Package Manager) vem incluso com o Node.js e é usado para instalar o Angular CLI globalmente na maquina. Sem Node.js, nao há npm, e sem npm, nao há como instalar o Angular CLI.

## Por que versao LTS?

O instrutor enfatiza: **sempre baixar a versao LTS**. LTS significa Long Term Support — é a versao que recebe correcoes de seguranca e bugs por mais tempo. A versao "Current" pode ter features experimentais que quebram compatibilidade com ferramentas como o Angular CLI.

Na aula, o instrutor usou Node.js v22.14.0 (LTS) com Angular CLI 19.2.4.

## Instalacao global vs local

O flag `-g` no comando `npm install -g @angular/cli` instala o Angular CLI **globalmente** — ou seja, o comando `ng` fica disponivel em qualquer diretorio do terminal. Isso é necessario porque o CLI é usado para criar novos projetos (que ainda nao existem como pasta com package.json).

## Fluxo completo da aula

1. Acessar nodejs.org → Download LTS → Instalar (Next, Next, Finish)
2. Abrir terminal (Windows+R → cmd)
3. `node --version` → confirmar instalacao
4. Acessar angular.dev → Docs → Installation → copiar comando
5. `npm install -g @angular/cli` → instalar
6. `ng version` → confirmar versao do Angular
7. `ng help` → ver comandos disponiveis

## Proximos passos mencionados

O instrutor indica que o proximo passo é instalar o Visual Studio Code como editor de codigo para desenvolvimento Angular.