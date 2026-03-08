---
name: rs-full-stack-aula-de-abertura-deploy
description: "Introduces the deployment phase for full-stack applications, covering server publishing of both application code and databases for production access. Use when user asks to 'deploy an app', 'publish to production', 'put app on a server', or 'make app available to users'. Make sure to use this skill whenever starting a deployment workflow for a full-stack Node.js application with a database. Not for CI/CD pipeline configuration, Docker orchestration, or Kubernetes cluster management."
---

# Deploy de Aplicações Full-Stack

> Deploy significa colocar a aplicação E o banco de dados em um servidor acessível por usuários reais em produção.

## Conceito-chave

Deploy não é apenas publicar código — envolve disponibilizar **dois componentes essenciais**: a aplicação (servidor Node.js/Express) e o banco de dados. Ambos precisam estar acessíveis e funcionando em conjunto para que usuários reais consigam utilizar a aplicação em produção.

## Framework de decisão

| Situação | Ação |
|----------|------|
| Aplicação pronta localmente | Planejar deploy da aplicação + banco de dados juntos |
| Apenas código no servidor | Verificar se banco de dados também está publicado e acessível |
| Usuários não conseguem acessar | Confirmar que servidor está rodando e acessível publicamente |
| Banco local funciona, produção não | Verificar configuração de conexão do banco em produção |

## Checklist de deploy

1. **Aplicação** — código publicado e rodando no servidor
2. **Banco de dados** — instância criada e acessível pelo servidor
3. **Conexão** — aplicação conecta ao banco de produção (não ao local)
4. **Acesso público** — usuários reais conseguem acessar a aplicação

## Quando aplicar

- Ao finalizar o desenvolvimento de uma aplicação full-stack
- Ao migrar de ambiente local para produção
- Ao configurar um servidor para hospedar aplicação + banco de dados

## Limitações

- Esta skill cobre o conceito geral de deploy — para configurações específicas de Docker, CI/CD ou cloud providers, consulte skills especializadas de DevOps

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o conceito de deploy full-stack
- [code-examples.md](references/code-examples.md) — Exemplos práticos de configuração para deploy