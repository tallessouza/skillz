# Deep Explanation: Deploy Front-end — Introdução

## O que é deploy front-end

Deploy é o processo de transferir uma aplicação que funciona no ambiente local do desenvolvedor para um servidor na web acessível publicamente. No contexto front-end, isso significa que o projeto (HTML, CSS, JavaScript, assets) será servido por um servidor web que qualquer pessoa com acesso à internet pode acessar.

O instrutor usa o termo "colocar a aplicação em produção" como sinônimo de deploy — produção é o ambiente onde os usuários finais interagem com a aplicação.

## Por que integração com GitHub é essencial

A integração com GitHub não é apenas sobre versionamento — ela cria um pipeline onde:

1. **O código fonte vive no GitHub** — repositório centralizado
2. **A branch `main` é a referência de produção** — toda vez que ela é atualizada, uma nova build pode ser gerada automaticamente
3. **O servidor de deploy monitora a branch `main`** — plataformas como Vercel e Netlify detectam pushes e fazem rebuild automático

Isso elimina o processo manual de "copiar arquivos para o servidor" e cria um fluxo automatizado e confiável.

## Estratégia de branches para deploy seguro

O instrutor enfatiza a importância de branches separadas para evitar que código não testado chegue à produção:

### Branch `main`
- Representa o estado atual de produção
- Toda nova build é gerada a partir dela
- Nunca deve receber commits diretos de features em desenvolvimento

### Branches de feature/desenvolvimento
- Criadas a partir da `main`
- Permitem desenvolver e testar isoladamente
- O desenvolvedor pode "visualizar o que mudou no código" antes de levar para produção
- Após teste e validação, faz merge na `main`

### O fluxo mental

```
Desenvolvimento local (branch feature)
    ↓
Testar mudanças isoladamente
    ↓
Merge na main
    ↓
Nova build gerada automaticamente
    ↓
Aplicação atualizada em produção
```

## Analogia implícita do instrutor

O instrutor trata o deploy como uma "ponte" — o projeto existe em dois mundos (local e produção) e o deploy é o mecanismo que conecta esses mundos. O GitHub com branches é o "controle de tráfego" dessa ponte, garantindo que só código validado cruze para o lado da produção.

## Contexto do módulo

Esta aula é a introdução de um módulo completo sobre deploy front-end. As aulas seguintes abordarão:
- Configuração prática da plataforma de hospedagem
- Integração efetiva com GitHub
- Gerenciamento de branches na prática
- Build da aplicação
- Testes em produção