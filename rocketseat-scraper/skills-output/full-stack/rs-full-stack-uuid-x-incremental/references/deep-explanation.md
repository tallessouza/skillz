# Deep Explanation: UUID x Incremental

## Por que IDs incrementais sao problematicos quando publicos

O ID incremental gera valores sequenciais: 1, 2, 3, 4... Isso significa que qualquer pessoa que conheca um ID pode inferir outros. Se um atacante ve `/users/42` na URL, ele sabe que existem usuarios de 1 a 41 e pode tentar acessar cada um.

Isso e chamado de **IDOR (Insecure Direct Object Reference)** — uma das vulnerabilidades mais comuns do OWASP Top 10. O ID incremental nao e a causa do IDOR (falta de autorizacao e), mas ele **facilita enormemente** a exploracao.

## Anatomia do UUID

O UUID (Universally Unique Identifier) segue o padrao RFC 4122. Formato:

```
f47ac10b-58cc-4372-a567-0e02b2c3d479
|______| |__| |__| |__| |__________|
  time   time  ver  var    random
```

- **Grupos separados por tracos** — 5 grupos com significados diferentes
- **Versao** — o terceiro grupo comeca com o numero da versao (4 = random)
- **Variante** — o quarto grupo indica a variante do UUID
- **Complexidade** — 2^122 combinacoes possiveis (mais que atomos na Terra)

### Versoes relevantes

| Versao | Como gera | Quando usar |
|--------|-----------|-------------|
| v4 | Totalmente aleatorio | Padrao mais comum, bom para a maioria dos casos |
| v7 | Timestamp + random | Quando precisa de ordenacao cronologica + unicidade |

## O que o instrutor enfatiza

O ponto central nao e que incremental seja "ruim" — e que cada tipo tem seu lugar:

- **Incremental** = IDs privados, internos ao banco, eficientes para joins e indexacao
- **UUID** = IDs publicos, expostos em requisicoes, dificeis de adivinhar

A analogia implicita: incremental e como numerar casas numa rua (facil de encontrar a proxima), UUID e como um endereco criptografado (precisa saber exatamente para encontrar).

## Trade-offs de performance

### Incremental
- **Vantagem:** Menor tamanho (4-8 bytes vs 16 bytes), melhor para B-tree indexes, insercoes sempre no final da arvore
- **Desvantagem:** Previsivel, problematico em sistemas distribuidos (colisao de sequencias)

### UUID v4
- **Vantagem:** Unicidade global sem coordenacao, impossivel de prever
- **Desvantagem:** 16 bytes, insercoes aleatorias no indice (fragmentacao), comparacao mais lenta

### UUID v7 (moderno)
- **Vantagem:** Ordenavel por tempo (resolve fragmentacao), unicidade global
- **Desvantagem:** Ainda 16 bytes, menos suportado que v4

## Padrao dual-ID

Em sistemas de producao, e comum usar ambos:

```
PK interna: id SERIAL (incremental) — usado em joins, FK, operacoes internas
ID publico: public_id UUID — usado em APIs, URLs, responses
```

Isso combina a eficiencia do incremental para operacoes de banco com a seguranca do UUID para exposicao publica.

## Quando NAO usar UUID

- Tabelas de lookup/configuracao que nunca sao expostas
- Tabelas de log internas
- Pivot tables (many-to-many) que so usam FKs
- Sistemas embarcados com restricao de armazenamento