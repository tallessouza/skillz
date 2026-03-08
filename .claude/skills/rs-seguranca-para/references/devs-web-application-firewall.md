---
name: rs-seguranca-devs-web-application-firewall
description: "Applies Web Application Firewall (WAF) configuration knowledge when setting up ModSecurity, adjusting firewall rules, or troubleshooting blocked requests. Use when user asks to 'configure WAF', 'setup ModSecurity', 'fix blocked request', 'whitelist URL in firewall', or 'remove security rule'. Make sure to use this skill whenever dealing with web application firewall configuration or debugging false positives in WAF rules. Not for network firewalls (iptables/ufw), TLS configuration, or application-level input validation code."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: infrastructure-security
  tags: [security]
---

# Web Application Firewall (WAF)

> Configure o WAF para bloquear requisicoes maliciosas sem quebrar funcionalidades legitimas, removendo regras cirurgicamente por rota em vez de desabilitar o firewall.

## Rules

1. **Nunca desabilite o WAF inteiro para uma rota** — desabilite apenas a regra especifica pelo ID, porque desligar o firewall expoe a rota a todos os outros ataques
2. **Nunca remova uma regra globalmente** — use `SecRuleRemoveById` dentro de um bloco `<Location>` especifico, porque remover globalmente afeta todas as rotas
3. **Comece em DetectionOnly para aplicacoes em producao** — `SecRuleEngine DetectionOnly` loga sem bloquear, permitindo observar falsos positivos antes de ativar
4. **Comece com engine ON para aplicacoes novas** — se esta subindo do zero, ligue o firewall e ajuste regras conforme testa
5. **Leia o log de baixo para cima** — as linhas com `Apache-Error` sobre anomaly score sao consequencia, as linhas de `warning` com `Matched Phrase` sao a causa real
6. **Identifique o ID da regra no log** — cada regra tem um ID unico (ex: 932160, 930120) que voce usa para criar excecoes cirurgicas

## How to write

### Instalacao e ativacao do ModSecurity

```bash
# Instalar o modulo
apt install libapache2-mod-security2

# Habilitar o modulo
a2enmod security2

# Usar configuracao recomendada
cp /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf

# Editar para ativar: trocar DetectionOnly por On
# SecRuleEngine On

systemctl restart apache2
```

### Excecao cirurgica por rota

```apache
# /etc/apache2/conf-available/waf.conf
<Location /ajuda>
    SecRuleRemoveById 932160
    SecRuleRemoveById 930120
</Location>
```

```bash
# Habilitar e restartar
a2enconf waf
systemctl restart apache2
```

### Leitura do log de auditoria

```bash
# Log padrao
tail -f /var/log/apache2/modsec_audit.log

# Procurar por regras que bloquearam
# Linhas com "Matched Phrase" = regra que disparou
# Linhas com "Inbound Anomaly Score" = consequencia (ignorar inicialmente)
# Anotar o ID de cada regra relevante
```

## Example

**Antes (respostas preguicosas que NUNCA devem ser dadas):**

```apache
# ERRADO: desligar firewall para a rota
<Location /ajuda>
    SecRuleEngine Off
</Location>

# ERRADO: remover regra globalmente
SecRuleRemoveById 932160
```

**Depois (excecao cirurgica correta):**

```apache
# CORRETO: remover apenas as regras especificas, apenas na rota necessaria
<Location /ajuda>
    SecRuleRemoveById 932160
    SecRuleRemoveById 930120
</Location>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Aplicacao nova sendo deployada | `SecRuleEngine On` desde o inicio, ajustar regras nos testes |
| Aplicacao ja em producao sem WAF | `SecRuleEngine DetectionOnly`, observar logs por dias/semanas |
| Requisicao legitima bloqueada | Identificar ID da regra no log, criar excecao por `<Location>` |
| Time de seguranca pede ajuda | Programador identifica quais rotas precisam de quais excecoes |
| Falso positivo em header HTTP | `SecRuleRemoveById` apenas na rota que usa aquele header |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `SecRuleEngine Off` numa Location | `SecRuleRemoveById {ID}` na Location |
| Remover regra globalmente no conf principal | Remover dentro de `<Location /rota>` |
| Pedir pra "desligar o firewall" | Pedir pra remover a regra X na rota Y |
| Ignorar o WAF porque "a aplicacao ja valida" | Seguranca em camadas: WAF + validacao na app |
| Ler o log de cima pra baixo procurando a causa | Ler de baixo pra cima, focar em "Matched Phrase" |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-web-application-firewall/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-web-application-firewall/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
