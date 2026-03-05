# Deep Explanation: Logs — Primeiro Pilar da Observabilidade

## Por que logs sao o primeiro pilar

O instrutor posiciona logs como a "primeira porta de entrada" quando o monitoramento detecta problemas. Exemplo: se o monitoramento mostra 50% de erro, como descobrir o que esta acontecendo? Logs. Sao os registros textuais que apontam onde e por que os problemas ocorrem.

## A armadilha do "quanto mais melhor"

O instrutor faz uma ressalva importante: mais logs = melhor debug, MAS existe custo de armazenamento. A sabedoria esta em logar nos fluxos criticos (especialmente erros) e ser seletivo com logs de sucesso. Em staging voce pode ser mais liberal; em producao, seja objetivo.

## Por que logs nao ficam na aplicacao

Historicamente (especialmente em PHP), era comum criar uma pasta `logs/` dentro do projeto com arquivos `.txt`. O instrutor explica por que isso nao funciona mais:

1. **Containers sao efemeros** — se o container morre (erro, scaling, deploy), os logs morrem junto
2. **Volumes resolveriam parcialmente** — mas como indexar e buscar eficientemente em arquivos txt?
3. **Ferramenta externa resolve ambos** — desacoplamento total entre emissao e armazenamento

A analogia e: a aplicacao EMITE logs, a ferramenta externa ARMAZENA e INDEXA. Sao responsabilidades separadas.

## Imutabilidade como principio

O instrutor e enfatico: log emitido e imutavel. Nao existe "editar o log que enviei". Se precisa de nova informacao, emita novo log. Isso e fundamental para auditoria e confiabilidade dos registros.

## Estrategias de armazenamento (custo vs necessidade)

O instrutor apresenta tres estrategias:

1. **Retencao limitada + archive** — 7 dias no campo transacional (para devs debugarem), depois zipa e manda para S3 Glacier/Deep Archive. Mais barato, mais lento para recuperar, mas disponivel para auditorias
2. **Retencao eterna** — mantém todo historico na ferramenta. Mais caro, mais conveniente
3. **Retencao + deleção** — ex: 30 dias, depois deleta. Mais barato, mas perde historico

A escolha depende do nicho: aplicacoes com requisitos de auditoria fiscal precisam manter logs; aplicacoes simples podem deletar.

## Padronizacao entre servicos

O instrutor destaca que se servico A manda log de um jeito, B de outro e C de outro, debugar e impraticavel. A solucao: criar uma lib interna que todos os servicos usam, responsavel por padronizar formato e enviar para a ferramenta correta.

## Niveis de severidade

- **info** — algo aconteceu com sucesso, registro informativo
- **warn** — nao completou a acao mas tambem nao errou (alerta, lentidao)
- **error** — erro de fato
- **critical** — falha grave (mencionado mas detalhado em aulas futuras)

Cada nivel tem cor especifica nas ferramentas e permite filtragem diferenciada.

## Ferramentas mencionadas

- **LogZIO** — exemplo mostrado pelo instrutor com interface de filtragem, queries tipo SQL, parsing de JSON
- Outras ferramentas serao abordadas nas aulas praticas

## Conexao com 12-Factor App

O instrutor referencia o 12-Factor: staging (interno, para testes) vs producao (cliente). Voce pode ser mais liberal com logs em staging para debug, e mais restritivo em producao.