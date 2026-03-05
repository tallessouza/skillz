# Deep Explanation: Atualizando o Ambiente de Desenvolvimento para o Angular 20

## Por que desinstalar antes de instalar?

O instrutor enfatiza o fluxo de **desinstalar** o Angular CLI antigo e depois **instalar** o novo, ao inves de tentar um update. Isso garante uma instalacao limpa, sem conflitos de versao ou cache residual.

## Version Compatibility Matrix

O Angular mantem uma pagina oficial de compatibilidade de versoes. Para cada major version do Angular, apenas versoes especificas do Node.js sao suportadas. No caso do Angular 20, as versoes suportadas sao Node.js 20, 22 e 24.

O instrutor estava usando Node.js 22.15.0, que esta dentro do range. Se voce estiver com uma versao muito antiga (ex: Node 18), vai precisar atualizar.

## npx vs Angular CLI Global

O instrutor menciona duas formas de criar projetos:

1. **Angular CLI global** (`ng new`): mais pratico se voce sempre trabalha com a mesma versao
2. **npx** (`npx @angular/cli@20 new`): mais flexivel, permite criar projetos em qualquer versao sem alterar o CLI global

O npx e especialmente util quando voce mantem projetos em versoes diferentes do Angular simultaneamente.

## Mudanca na nomenclatura de arquivos (Angular 20)

O instrutor destaca uma mudanca significativa: no Angular 20, os arquivos perderam os sufixos tradicionais como `.component.ts`, `.service.ts`, `.pipe.ts`. Ele nao detalha neste video (sera no proximo), mas avisa que:

- Nao e um bug, e uma decisao do framework
- Existem beneficios em nao ter o sufixo
- O instrutor promete ensinar uma forma de organizar que nao gera confusao

## Sobre a opcao Zoneless

Quando o Angular pergunta se voce quer uma "zoneless application", o instrutor instrui a responder **N** (nao). Zoneless e um conceito que sera abordado posteriormente no curso. Usar zoneless sem entender o conceito pode causar comportamentos inesperados, especialmente com change detection.

## Sobre a opcao de AI

O Angular 20 introduz uma pergunta sobre configuracao de IA no projeto. O instrutor escolhe "None" pois nao e relevante para o aprendizado do framework em si.

## Organizacao de pastas

O instrutor sugere organizar os projetos do curso em pastas por nivel:
```
skillz-angular/
├── nivel-1/
│   └── (projetos do nivel 1)
└── nivel-2/
    └── projeto-versao-20/
```