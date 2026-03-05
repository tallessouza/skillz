# Code Examples: Instalacao do Node.js e NPM

## Verificacao basica pos-instalacao

Os dois comandos essenciais mostrados na aula:

```bash
# Verificar versao do Node
node --version
# Saida esperada: v22.16.0 (ou similar)

# Verificar versao do NPM
npm --version
# Saida esperada: 10.9.2 (ou similar)
```

O instrutor nota que o comando `npm --version` "geralmente demora um pouquinho mais" — isso e normal, especialmente na primeira execucao apos instalacao.

## Fluxo completo no terminal

```bash
# 1. Abrir um NOVO terminal (importante: nao usar terminal que estava aberto antes da instalacao)

# 2. Verificar Node
$ node --version
v22.15.0

# 3. Verificar NPM
$ npm --version
10.9.2

# Se ambos retornaram versoes, a instalacao foi bem-sucedida
```

## Troubleshooting

```bash
# Se "command not found":
# Passo 1: Fechar TODOS os terminais
# Passo 2: Abrir um terminal novo
# Passo 3: Tentar novamente
node --version

# Se ainda nao funcionar:
# Passo 1: Reiniciar a maquina
# Passo 2: Abrir terminal
# Passo 3: Tentar novamente
node --version
```

## Verificacao para contexto Angular

```bash
# Apos confirmar Node e NPM, o proximo passo tipico seria:
npm install -g @angular/cli

# Verificar Angular CLI
ng version
```

Nota: A instalacao do Angular CLI nao faz parte desta aula, mas e o proximo passo natural apos ter Node e NPM funcionando.