# Deep Explanation: Preparação de Projeto para Deploy

## Contexto do Projeto

O projeto utilizado é o **RocketLog**, uma API de entregas desenvolvida em módulos anteriores do curso full-stack da Rocketseat. Este módulo de deploy usa esse projeto como base para ensinar o processo de colocar uma aplicação em produção.

## Por que um template?

O instrutor disponibiliza o projeto completo como template no GitHub por razões práticas:

1. **Alunos que pularam módulos** — Nem todos seguem a ordem linear do curso. Alguns vêm direto para o módulo de deploy.
2. **Projetos perdidos** — Alunos que fizeram o módulo anterior podem ter perdido o código, mudado de máquina, ou ter uma versão incompleta.
3. **Estado garantido** — O template garante que todos partem do mesmo ponto, evitando bugs causados por diferenças entre versões do projeto.

## Organização de Pastas

O instrutor demonstra uma prática importante: criar uma pasta dedicada para o contexto de deploy (`deploy/`) e mover o projeto para dentro dela. Isso separa o ambiente de desenvolvimento do ambiente de preparação para deploy, mantendo a organização do workspace.

### Estrutura sugerida

```
projetos/
├── desenvolvimento/    # Projetos em desenvolvimento ativo
├── deploy/             # Projetos sendo preparados para deploy
│   └── rocket-log/     # Projeto atual
└── arquivados/         # Projetos finalizados
```

## npm install vs npm i

O instrutor menciona que `npm i` é a abreviação de `npm install`. Ambos fazem exatamente a mesma coisa:

- Leem o `package.json`
- Resolvem a árvore de dependências
- Baixam pacotes para `node_modules/`
- Geram/atualizam o `package-lock.json`

## Fluxo completo demonstrado

1. Abrir link do repositório no navegador
2. Clicar em **Code** → **Download ZIP**
3. Extrair o ZIP na pasta de downloads
4. Renomear a pasta extraída para `rocket-log`
5. Mover para pasta organizada de deploy
6. Arrastar pasta para o VSCode
7. Abrir terminal integrado
8. Executar `npm i`
9. Aguardar instalação das dependências
10. Projeto pronto para as próximas etapas de deploy

## Download ZIP vs Git Clone

O instrutor opta por Download ZIP ao invés de `git clone`. Para fins de deploy tutorial, isso simplifica o processo — não precisa de autenticação Git, não carrega histórico de commits, e o aluno recebe apenas os arquivos necessários. Em ambiente profissional, `git clone` é preferível porque mantém o versionamento.