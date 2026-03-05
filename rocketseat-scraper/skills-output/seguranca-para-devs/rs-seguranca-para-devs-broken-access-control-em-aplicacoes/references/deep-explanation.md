# Deep Explanation: Broken Access Control

## Por que e a falha #1 do OWASP Top 10

O Broken Access Control ocupa o primeiro lugar no OWASP Top 10 (versao 2021 e continua em 2025). Isso significa que, de todas as falhas de seguranca em aplicacoes web, essa e a mais frequentemente encontrada em producao.

## A natureza do problema: falha de logica de negocio

O instrutor enfatiza um ponto crucial que diferencia Broken Access Control de outras vulnerabilidades:

> "Essa falha e uma falha na logica de negocios. Nao tem nada que um firewall pudesse fazer, nao tem nada que pudesse ser feito fora da programacao para pegar essa falha. Nao tem nem como uma inteligencia artificial encontrar essa falha de negocio."

Isso acontece porque a definicao de "quem pode acessar o que" e intrinsecamente ligada ao dominio do negocio:
- Um sistema de tickets onde cada usuario so ve os proprios tickets — regra de negocio
- Um sistema onde todos veem todos os tickets — tambem e uma regra de negocio valida
- Um banco onde cada cliente so ve seu extrato — parece obvio, mas so porque conhecemos o dominio

A IA pode sugerir validacoes, mas nao pode determinar com certeza qual e a regra correta, porque isso depende do contexto do negocio.

## IDOR (Insecure Direct Object Reference)

O instrutor explica que IDOR e Broken Access Control sao "basicamente o mesmo erro do programador". IDOR e a tecnica especifica onde o atacante manipula referencias diretas a objetos (como IDs sequenciais na URL) para acessar recursos de outros usuarios.

O exemplo classico: se voce esta em `/ticket/1`, o atacante tenta `/ticket/2`, `/ticket/3`, etc.

## Como a falha nasce naturalmente

O instrutor demonstra algo muito importante sobre a psicologia do desenvolvimento:

> "Voce se entretene fazendo a aplicacao funcionar. Porque, na verdade, e isso que um programador tem que fazer — gastar o tempo dele, a energia dele em fazer as coisas funcionarem. E ai, entretido nisso, voce nem viu que foi inserida aqui uma falha de seguranca."

A falha nao nasce de negligencia — nasce do foco natural do programador em fazer as coisas funcionarem. A validacao de acesso e facilmente esquecida porque nao e necessaria para o "caminho feliz" funcionar.

## Os 6 vetores de ataque

O instrutor lista todos os lugares onde o atacante pode injetar dados maliciosos:

1. **URL path** — `/ticket/2` (trocar ID na URL)
2. **Query string** — `?object=user&id=33` (trocar parametros)
3. **Campos hidden de formulario** — inspecionar e alterar antes de submit
4. **Headers HTTP** — incluindo cookies, roles, ultimo objeto editado
5. **Corpo do POST (JSON)** — trocar `accountId`, `groupId` dentro do payload
6. **Metodo HTTP** — validar no GET mas esquecer no PUT/DELETE

## O problema dos endpoints genericos

O instrutor alerta especificamente sobre funcoes "genericas" que servem multiplas tabelas:

> "Ah, e um codigo generico que eu fiz porque eu escrevo uma funcao de update so que serve para qualquer tabela no banco de dados. Cuidado com isso, essa e uma ideia muito legal, um update so para qualquer tabela, pode economizar codigo, mas voce precisa ter uma restricao de acesso solida no comeco disso ai, porque os caras vao tentar abusar."

Atacantes vao trocar `object=user` por `object=group`, `object=environment`, etc.

## O esquecimento classico no DELETE

O instrutor destaca um padrao de erro extremamente comum:

> "Na GET, na POST, voce faz uma avaliacao de restricao de acesso. [...] Ai na PUT voce nao pode esquecer. E ai muita gente faz isso e esquece de fazer essa mesma validacao no DELETE. Essa falha e muito comum, ja vi acontecer bastante."

## A responsabilidade e do programador

> "No final das contas, voce entendeu que a responsabilidade e sua, porque essa falha de seguranca tem a ver com as regras de negocio. Nao tem outra pessoa, que nao o programador, que vai resolver esse problema."

Pode ter analista, produto, QA ajudando — mas a implementacao e responsabilidade do dev.

## Como prevenir na pratica

O instrutor sugere uma abordagem em 3 camadas:

1. **Modelagem** — as regras de acesso devem estar escritas nos requisitos tecnicos
2. **Implementacao** — cada rota valida ownership
3. **Testes** — testes automatizados que tentam acessar recursos de outros usuarios

> "Precisa estar escrito la, falando que cada usuario so pode acessar o proprio ticket. Se ele trocar, tentar acessar, trocando na URL, o ticket de outro usuario, ele deve obter um erro de nao autorizado. Entao, isso tem que estar modelado e tem que estar testado."