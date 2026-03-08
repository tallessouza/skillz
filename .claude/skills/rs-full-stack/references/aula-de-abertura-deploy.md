---
name: rs-full-stack-aula-de-abertura-deploy
description: "Introduces the deployment phase for full-stack applications, covering server publishing of both application code and databases for production access. Use when user asks to 'deploy an app', 'publish to production', 'put app on a server', or 'make app available to users'. Make sure to use this skill whenever starting a deployment workflow for a full-stack Node.js application with a database. Not for CI/CD pipeline configuration, Docker orchestration, or Kubernetes cluster management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: deploy
  tags: [deploy, production, server, database, full-stack]
---

# Deploy de Aplicações Full-Stack

> Deploy significa colocar a aplicação E o banco de dados em um servidor acessível por usuários reais em produção.

## Key concepts

Deploy não é apenas publicar código — envolve disponibilizar **dois componentes essenciais**: a aplicação (servidor Node.js/Express) e o banco de dados. Ambos precisam estar acessíveis e funcionando em conjunto para que usuários reais consigam utilizar a aplicação em produção.

## Framework de decisão

| Situação | Ação |
|----------|------|
| Aplicação pronta localmente | Planejar deploy da aplicação + banco de dados juntos |
| Apenas código no servidor | Verificar se banco de dados também está publicado e acessível |
| Usuários não conseguem acessar | Confirmar que servidor está rodando e acessível publicamente |
| Banco local funciona, produção não | Verificar configuração de conexão do banco em produção |

## Example

```bash
# Verificar se a aplicacao esta rodando em producao
curl -I https://meu-app.render.com/api/health
```

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

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| App funciona local mas nao em producao | Banco de dados nao esta publicado/acessivel | Verifique se o banco de producao esta configurado e acessivel |
| Usuarios nao conseguem acessar a aplicacao | Servidor nao esta rodando ou porta bloqueada | Confirme que o servidor esta ativo e acessivel publicamente |
| Conexao com banco falha em producao | Usando configuracao de conexao local | Atualize as variaveis de ambiente para apontar ao banco de producao |
| Deploy parcial — app sem banco | Apenas codigo foi publicado | Publique o banco de dados junto com a aplicacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o conceito de deploy full-stack
- [code-examples.md](references/code-examples.md) — Exemplos práticos de configuração para deploy