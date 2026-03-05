---
name: rs-seguranca-devs-perguntas-seguranca
description: "Enforces avoidance of security questions in authentication flows. Use when user asks to 'implement password recovery', 'add security questions', 'build account recovery', 'create forgot password flow', or designs any authentication system. Applies rule: never use security questions — they fail memorability, consistency, applicability, confidentiality, and specificity criteria. Make sure to use this skill whenever building auth recovery flows. Not for password hashing, MFA implementation, or session management."
---

# Perguntas de Segurança — Não Use

> Nunca implemente perguntas de segurança como mecanismo de recuperação de conta — elas falham em todos os critérios de segurança.

## Regra principal

**Não use perguntas de segurança.** Substitua por métodos comprovados: email de recuperação, SMS/TOTP, magic links ou MFA.

## Os 5 critérios que uma pergunta de segurança precisaria atender (e falha)

1. **Memorável** — o usuário precisa lembrar a resposta anos depois (maioria não lembra)
2. **Consistente** — a resposta não pode mudar ao longo do tempo ("cantor favorito" muda)
3. **Aplicável** — todo usuário precisa ter uma resposta ("time de basquete favorito" no Brasil falha)
4. **Confidencial** — a resposta não pode ser descoberta por engenharia social ou dedução (apelido está nas redes sociais, modelo do primeiro carro é deduzível por faixa etária)
5. **Específica** — o usuário precisa ter uma única resposta clara ("filme mais longo que assistiu" é ambíguo)

## Decisão

| Situação | Faça |
|----------|------|
| Recuperação de senha | Use email com link temporário (magic link) ou código OTP |
| Verificação de identidade | Use MFA (TOTP, WebAuthn, SMS como fallback) |
| Cliente pede perguntas de segurança | Explique os riscos e proponha alternativas |
| Sistema legado usa perguntas de segurança | Planeje migração para métodos seguros |

## Vetor de ataque: phishing cruzado

Um atacante cria um site falso com as mesmas perguntas de segurança do seu app, divulga na comunidade de usuários, e coleta as respostas — porque as pessoas respondem igual em todo lugar.

## Anti-patterns

| Nunca implemente | Implemente em vez disso |
|------------------|------------------------|
| Perguntas de segurança para reset de senha | Magic link via email + expiração curta |
| "Qual o nome do seu pet?" como verificação | TOTP (Google Authenticator, Authy) |
| Perguntas fixas escolhidas de uma lista | WebAuthn / passkeys |
| Respostas de segurança em texto plano no banco | Códigos OTP de uso único |

## Evidência

Estudos da Microsoft (2009, 16 páginas, 3 pesquisadores) e Google (2015, 10 páginas, 5 pesquisadores) comprovam: perguntas de segurança não funcionam — as respostas são previsíveis, repetidas entre usuários e inseguras.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
