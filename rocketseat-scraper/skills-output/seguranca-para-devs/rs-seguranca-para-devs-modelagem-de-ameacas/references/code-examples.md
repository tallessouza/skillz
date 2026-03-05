# Code Examples: Modelagem de Ameacas

## Setup do Threat Dragon com Docker

### Arquivo .env

```bash
# Gerar chaves aleatorias no Linux
openssl rand -hex 16
# Exemplo de saida: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6

# .env para Threat Dragon
ENCRYPTION_KEYS=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
ENCRYPTION_JWT_SIGNING_KEY=f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3
ENCRYPTION_JWT_REFRESH_SIGNING_KEY=1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d
```

### Rodar Threat Dragon no Docker

```bash
# Usando a imagem stable
docker run -p 8080:3000 \
  --env-file .env \
  owasp/threat-dragon:stable

# Acessar em http://localhost:8080
```

## Exemplo de diagrama modelado na aula

### Componentes do sistema

```
┌─────────────────────────────────────────────────────────┐
│  INTERNET (Trust Boundary)                              │
│                                                         │
│  ┌──────────────┐                                       │
│  │  Sistema      │  (Fora de escopo:                    │
│  │  Parceiro     │   desenvolvido por parceiros)        │
│  └──────┬───────┘                                       │
│         │ REST/HTTPS (encriptado, rede publica)         │
├─────────┼───────────────────────────────────────────────┤
│         │                                               │
│  ┌──────▼───────┐    ┌──────────────────┐               │
│  │  Proxy de    │    │  PostgreSQL       │               │
│  │  APIs        ├────┤  (Auth + Authz)   │               │
│  │              │    │                   │               │
│  └──────┬───────┘    └──────────────────┘               │
│         │  Trust Boundary (usuario limitado, nao root)  │
│         │                                               │
├─────────┼───────────────────────────────────────────────┤
│  VPN INTERNA                                            │
│         │                                               │
│  ┌──────▼───────┐    ┌──────────────────┐               │
│  │  Sistema A   │    │  Sistema B        │               │
│  │  (GraphQL)   │    │  (fora de escopo) │               │
│  └──────────────┘    └──────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

### Fluxos de dados

| De | Para | Protocolo | Rede |
|----|------|-----------|------|
| Sistema Parceiro | Proxy de APIs | REST/HTTPS | Publica (encriptada) |
| Proxy de APIs | PostgreSQL | PostgreSQL protocol | Interna |
| Proxy de APIs | Sistema A | GraphQL | VPN interna |
| Proxy de APIs | Sistema B | REST | VPN interna |

### Trust Boundaries definidas

| Boundary | Componentes internos | Componentes externos | Justificativa |
|----------|---------------------|---------------------|---------------|
| Internet | Proxy de APIs | Sistema Parceiro | Parceiro esta fora de escopo, desenvolvido por terceiros |
| DB Isolation | Proxy (usuario limitado) | PostgreSQL (root) | Invasao do proxy nao deve dar acesso root ao banco |
| VPN Interna | Sistemas A e B | Proxy de APIs | Separacao de rede interna |

## Ameacas identificadas na aula

### Proxy de APIs

| Ameaca | Categoria STRIDE | Severidade | Mitigacao proposta |
|--------|-----------------|------------|-------------------|
| Credential Stuffing | Spoofing | Alta | Token por parceiro + rate limit + validacao Have I Been Pwned |
| Outdated Components | Spoofing | Media | Manter dependencias (PyPI/npm) atualizadas |

### PostgreSQL

| Ameaca | Categoria STRIDE | Severidade | Mitigacao proposta |
|--------|-----------------|------------|-------------------|
| Data Scraping | Information Disclosure | Alta | Permissoes minimas, logs de acesso |
| Elevation of Privilege | Elevation of Privilege | Alta | Usuario da app nunca e root |
| Credential Cracking | Spoofing | Alta | Senha forte, rotacao periodica |
| Spamming | Denial of Service | Media | Rate limiting, monitoramento |
| Account Creation | Spoofing | Media | Controle de criacao de contas |

## Cadeia de mitigacao: Credential Stuffing

```
Ameaca: Credential Stuffing no Proxy de APIs

Pergunta 1: Como impedir tentativas com credenciais vazadas?
  → Mitigacao: Token secreto compartilhado por parceiro (pre-autenticacao)
  → Sem token valido, nao ha tentativa de login

Pergunta 2: E se invadirem o sistema do parceiro e roubarem o token?
  → Mitigacao: Rate limiting por parceiro
  → Limita volume de tentativas mesmo com token valido

Pergunta 3: E se o atacante fizer poucas tentativas por dia, durante meses?
  → Mitigacao: Validar credenciais contra Have I Been Pwned
  → Se senha vazada for usada, gerar alerta para administradores

Status: Open (ate implementacao de todas as camadas)
```

## Cornucopia — exemplos de cartas

### Carta: 5 de Autenticacao
```
"Javier pode usar credenciais de teste, credenciais default ou credenciais 
faceis de adivinhar para se autenticar. Ou pode usar uma conta antiga ou 
uma conta nao necessaria para a aplicacao."

Exemplo de argumento do jogador:
"Nosso framework cria um usuario admin/admin na instalacao e a gente nao 
apaga no ambiente de CI. Qualquer pessoa com acesso ao CI pode logar."

→ Ameaca aceita → vira tarefa: remover usuario default no deploy
```

### Carta: maior que 5 de Autenticacao
```
"Cecilia pode usar um ataque de forca bruta ou de dicionario contra uma 
ou varias contas, sem limite. Esses ataques sao simplificados por 
complexidade insuficiente, comprimento, expiracao e requerimentos de 
reuso para senhas."

Exemplo de argumento:
"Nao temos rate limiting e a politica de senha aceita '123456'."

→ Ameaca aceita → tarefa: implementar rate limiting + politica de complexidade
```

## Recursos

| Recurso | URL |
|---------|-----|
| OWASP Threat Dragon | https://threatdragon.org |
| OWASP Cornucopia | https://cornucopia.owasp.org |
| Microsoft Threat Modeling Tool | https://aka.ms/threatmodelingtool |
| Have I Been Pwned API | https://haveibeenpwned.com/API |