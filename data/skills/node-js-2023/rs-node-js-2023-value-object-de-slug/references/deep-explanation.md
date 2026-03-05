# Deep Explanation: Value Object de Slug

## O que e um Value Object no DDD

Value Objects sao propriedades de entidades que possuem regras de negocio associadas a elas — validacoes, formatacoes, transformacoes — que justificam serem representadas como classes separadas, com funcionamento isolado da entidade principal.

A analogia do instrutor e clara: **certas propriedades sao quase entidades por si so.** Elas possuem logica suficiente para existirem como classes independentes.

## Por que extrair um Slug em Value Object

O instrutor apresenta a evolucao natural do problema:

1. **Primeiro cenario:** Gerar slug automaticamente a partir do titulo — precisa de normalizacao Unicode, lowercase, regex para caracteres especiais
2. **Segundo cenario:** Permitir que o usuario escolha o slug manualmente — precisa de validacao para garantir formato valido
3. **Acumulo de regras:** Cada novo requisito adiciona mais logica dentro da entidade Question

Quando voce percebe que uma propriedade acumula regras de negocio proprias, ela deve ser extraida. O slug e um caso classico porque:
- Tem normalizacao complexa (Unicode NFKD)
- Tem multiplas transformacoes (lowercase, trim, regex)
- Tem dois modos de criacao (automatico vs manual)
- Pode ser reutilizado em outras entidades (respostas tambem podem ter slug)

## A dualidade de criacao

O instrutor enfatiza um insight importante: existem dois momentos distintos:

1. **Criacao nova** — o slug nao existe ainda, precisa ser gerado/validado → `Slug.createFromText(title)`
2. **Reconstituicao** — o slug ja existe no banco, ja foi validado antes → `new Slug(savedSlug)`

Essa dualidade e fundamental em DDD. Dados novos passam por todas as regras. Dados persistidos ja foram validados e podem ser reconstituidos diretamente.

## Quando NAO criar Value Objects

O instrutor faz um alerta importante: **nem tudo deve virar Value Object.** Se voce olhar com nivel muito detalhista, quase todos os campos poderiam ser extraidos. O titulo poderia ter capitalizacao automatica, o content poderia ter limite de caracteres.

O criterio e:
- **Quantidade significativa de codigo/logica agregada**
- **Potencial de reuso entre entidades**
- **Regras que justificam isolamento**

Value Objects triviais (ex: um campo que so precisa de `.trim()`) nao justificam a extracao.

## A funcao normalize('NFKD')

O instrutor destaca que descobriu essa funcao pesquisando. `String.prototype.normalize('NFKD')` usa a decomposicao de compatibilidade Unicode — ela separa caracteres acentuados em base + diacritico, permitindo que a regex seguinte remova os diacriticos e deixe apenas os caracteres base.

Exemplo: `"café"` → normalize NFKD → `"café"` (onde o acento vira caractere separado) → regex remove → `"cafe"`

## O valor dos testes imediatos

O instrutor mostra na pratica como testes revelam erros rapidamente. Ao criar o teste do slug, dois bugs foram encontrados imediatamente:
1. Espacos estavam sendo substituidos por string vazia em vez de hifen
2. Faltavam caracteres na regex (`-` e `+`)

Isso reforça que Value Objects, por terem logica isolada, sao candidatos perfeitos para testes unitarios rapidos.