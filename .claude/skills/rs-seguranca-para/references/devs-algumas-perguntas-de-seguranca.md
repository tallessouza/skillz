---
name: rs-seguranca-devs-perguntas-seguranca
description: "Enforces avoidance of security questions in authentication and account recovery flows. Use when user asks to 'implement password recovery', 'add security questions', 'build account recovery', 'create forgot password flow', or designs any authentication system with knowledge-based verification. Applies rule: never use security questions because they fail memorability, consistency, applicability, confidentiality, and specificity criteria per Microsoft and Google research. Make sure to use this skill whenever building auth recovery flows to prevent insecure fallback mechanisms. Not for password hashing (use devs-seguranca-no-armazenamento-de-senhas), MFA implementation (use devs-seguranca-em-multiplos-fatores), or session management (use devs-sobre-sessoes)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: authentication
  tags: [security, authentication, password-recovery, security-questions, account-recovery]
---

# Perguntas de Seguranca — Nao Use

> Nunca implemente perguntas de seguranca como mecanismo de recuperacao de conta — elas falham em todos os criterios de seguranca.

## Regra principal

**Nao use perguntas de seguranca.** Substitua por metodos comprovados: email de recuperacao, SMS/TOTP, magic links ou MFA.

## Os 5 criterios que uma pergunta de seguranca precisaria atender (e falha)

1. **Memoravel** — o usuario precisa lembrar a resposta anos depois (maioria nao lembra)
2. **Consistente** — a resposta nao pode mudar ao longo do tempo ("cantor favorito" muda)
3. **Aplicavel** — todo usuario precisa ter uma resposta ("time de basquete favorito" no Brasil falha)
4. **Confidencial** — a resposta nao pode ser descoberta por engenharia social (apelido esta nas redes sociais, modelo do primeiro carro e deduzivel por faixa etaria)
5. **Especifica** — o usuario precisa ter uma unica resposta clara ("filme mais longo que assistiu" e ambiguo)

## Decision framework

| Situacao | Faca |
|----------|------|
| Recuperacao de senha | Use email com link temporario (magic link) ou codigo OTP |
| Verificacao de identidade | Use MFA (TOTP, WebAuthn, SMS como fallback) |
| Cliente pede perguntas de seguranca | Explique os riscos e proponha alternativas |
| Sistema legado usa perguntas de seguranca | Planeje migracao para metodos seguros |

## Vetor de ataque: phishing cruzado

Um atacante cria um site falso com as mesmas perguntas de seguranca do seu app, divulga na comunidade de usuarios, e coleta as respostas — porque as pessoas respondem igual em todo lugar.

## Anti-patterns

| Nunca implemente | Implemente em vez disso |
|------------------|------------------------|
| Perguntas de seguranca para reset de senha | Magic link via email + expiracao curta |
| "Qual o nome do seu pet?" como verificacao | TOTP (Google Authenticator, Authy) |
| Perguntas fixas escolhidas de uma lista | WebAuthn / passkeys |
| Respostas de seguranca em texto plano no banco | Codigos OTP de uso unico |

## Evidencia

Estudos da Microsoft (2009, 16 paginas, 3 pesquisadores) e Google (2015, 10 paginas, 5 pesquisadores) comprovam: perguntas de seguranca nao funcionam — as respostas sao previsiveis, repetidas entre usuarios e inseguras.

## Troubleshooting

### Cliente insiste em perguntas de seguranca
**Symptom:** Requisito de negocio exige "perguntas de seguranca" no fluxo de recuperacao
**Cause:** Concepcao ultrapassada de seguranca, baseada em praticas bancarias antigas
**Fix:** Apresente as pesquisas da Microsoft e Google. Proponha magic link + MFA como alternativa superior em usabilidade e seguranca. Se for absolutamente obrigatorio, trate as respostas como senhas (hash + salt) e nunca as exiba.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-algumas-perguntas-de-seguranca/references/deep-explanation.md) — Raciocinio completo sobre cada criterio, exemplos reais de falha, pesquisas academicas
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-algumas-perguntas-de-seguranca/references/code-examples.md) — Alternativas implementaveis com codigo
