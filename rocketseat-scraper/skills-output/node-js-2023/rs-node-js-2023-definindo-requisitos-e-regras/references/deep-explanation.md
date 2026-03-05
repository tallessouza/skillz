# Deep Explanation: Definindo Requisitos e Regras de Negocio

## Por que separar em tres categorias?

O instrutor Diego explica que essa separacao permite entender a aplicacao "de dentro para fora". Cada categoria tem uma origem diferente:

- **RFs e RNs** nascem da conversacao com o cliente, do produto, do design. Sao coisas que o usuario final entende e pede.
- **RNFs** nascem do time tecnico. O cliente jamais pediria "use PostgreSQL" ou "pagine com 20 itens" — sao decisoes que so o desenvolvedor entende.

## Regra de Negocio como os "ifs" da aplicacao

Uma analogia tecnica poderosa do Diego: **regras de negocio sao os `if`s da aplicacao**. Se o RF diz "deve ser possivel fazer check-in", a RN diz "SE o usuario estiver a menos de 100m" ou "SE o usuario nao fez check-in hoje".

Cada RN cria um caminho diferente no fluxo. Por isso toda RN precisa estar associada a um RF — ela e um caminho/condicao de uma funcionalidade.

## RF nao e rota HTTP

O Diego enfatiza: "em nenhum momento eu estou falando que isso vai ser uma rota HTTP". Um RF como "deve ser possivel validar o check-in" pode virar:
- Um endpoint HTTP
- Uma integracao que outros softwares consomem
- Um webhook
- Um processo automatizado

A forma de exposicao e uma decisao de implementacao, nao de requisito.

## RN imprescindivel vs validacao trivial

Nem toda validacao e regra de negocio. "Email duplicado" e RN porque e imprescindivel para o funcionamento correto da aplicacao. "Nome vazio" e validacao basica que se resolve na hora do desenvolvimento, sem precisar documentar.

O criterio: se a violacao dessa regra compromete a logica central da aplicacao, e RN. Se e apenas sanitizacao de input, e validacao.

## O contexto real de um produto

O Diego reconhece que na vida real, requisitos nao nascem assim. Existe:
1. Uma dor do cliente ou oportunidade de mercado
2. Conversacao com o cliente
3. Equipe de produto ideando
4. Design e exploracao
5. Tecnicas de design de software (DDD, etc.)

O que ele faz na aula e partir direto para a parte tecnica, pulando essas etapas. Isso e proposital para focar no codigo, mas no dia a dia voce tera muito mais contexto antes de escrever RFs.

## Por que um app estilo GymPass?

Diego escolheu esse projeto porque envolve logicas comuns mas nao triviais:
- **Geolocalizacao** — calculos de distancia entre latitude/longitude no backend
- **Verificacoes de data/tempo** — check-in valido por 20 minutos
- **Autorizacao** — admin vs usuario comum
- **Duplicidade temporal** — nao pode repetir check-in no mesmo dia

Essas sao situacoes reais que desenvolvedores enfrentam e precisam resolver.

## Requisitos sao hipoteticos e iterativos

O Diego deixa claro: "nao necessariamente tudo que a gente digitar aqui vai ser exatamente como a gente digitou". Requisitos evoluem conforme o software e construido. Voce descobre buracos e adiciona novos requisitos ao longo do desenvolvimento.