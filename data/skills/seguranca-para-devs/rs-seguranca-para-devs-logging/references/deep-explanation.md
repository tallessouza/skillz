# Deep Explanation: Logging de Seguranca

## Por que log e uma ferramenta de seguranca

O instrutor enfatiza que log nao serve apenas para debugging — e uma ferramenta critica de seguranca. Os casos de uso de seguranca incluem:

- **Monitoramento anti-automacao**: detectar robos nao autorizados
- **Investigacao de incidentes**: reconstruir o que aconteceu durante uma invasao
- **Violacoes de politica**: identificar quem fez algo proibido
- **Nao-repudio**: o usuario aceitou termos/cookies, depois nega na justica. O perito vai pedir os logs
- **Trilhas de auditoria**: quem adicionou, modificou, excluiu, exportou dados
- **Demandas judiciais**: investigacoes policiais, pedidos de juiz. Num caso extremo, o juiz pode ordenar que voce logue TUDO de usuarios especificos (incluindo dados sensiveis que normalmente nao logaria)

## A analogia do "select manipulado"

Um dos insights mais valiosos do instrutor: se voce tem um `<select>` com 8 paises e recebe um POST com um pais diferente desses 8, **isso e um evento de alta seguranca**. Nenhum usuario legitimo vai inspecionar o HTML, adicionar uma option e submeter. Isso e um hacker testando sua aplicacao. Nao apenas bloqueie — logue.

Esse principio se estende a qualquer valor recebido fora de um conjunto finito e discreto de valores validos.

## Por que separar armazenamento

O instrutor usa o conceito de zero trust em camadas:

- Se a aplicacao for comprometida, o atacante NAO deve ter acesso ao historico de logs (senao ele sabe exatamente o que voce monitora e pode cobrir rastros)
- Se os logs vazarem, NAO devem conter dados que permitam comprometer a aplicacao (session IDs, tokens, senhas)

Exemplos praticos:
- **Systemd**: o usuario da aplicacao nao tem acesso aos logs do Systemd, precisa ser admin
- **AWS**: token do S3 nao pode dar acesso ao CloudWatch e vice-versa — usuarios IAM separados
- **PostgreSQL**: banco de log separado do banco da aplicacao, senhas diferentes

## O cenario de vazamento de log

O instrutor descreve um cenario realista: um analista de infra manda o log por email para alguem analisar. O Outlook desse cara e comprometido. O log vazou sem que servidor, codigo ou banco de dados tenham sido afetados.

Por isso, o log deve ser tratado como um ativo que PODE vazar independentemente. Tudo nele deve ser projetado assumindo que alguem mal-intencionado pode le-lo.

## Dados ilegais no log

Insight critico: empresas fazem todo o trabalho juridico para anonimizar dados na aplicacao, consultam advogados, cumprem LGPD. Mas ninguem olha os logs. Os logs acabam contendo dados coletados ilegalmente (sem opt-in, proibidos pela legislacao local). Se o log vazar, a empresa e processada e perde.

## Duas timestamps

Em aplicacoes web simples, timestamp do log = timestamp do evento. Mas em sistemas com filas/eventos assincronos, pode haver 40 minutos de diferenca. Logue ambos: quando aconteceu e quando foi processado.

## Versao da aplicacao no log

Se voce nao usa versionamento semantico, logue o commit hash. Quando investigar um incidente de 2 semanas atras, voce precisa saber qual codigo estava rodando. Sem isso, a investigacao e muito mais dificil.

## Monitoramento de logs — metricas sugeridas

O instrutor recomenda monitorar desvios da media em:

1. **Logins por IP por dia** — pico indica brute force ou credential stuffing
2. **Logins fora do horario comercial** — apps corporativas nao devem ter atividade na madrugada
3. **Geolocalizacao dos dados** — sistema brasileiro com trafego para Romenia e suspeito
4. **Bytes transferidos por IP destino** — exfiltracao de dados
5. **Logins falhos por usuario** — ataque de forca bruta
6. **Restarts da aplicacao** — instabilidade ou ataque
7. **Mensagens de erro por dia** — pico pode indicar probing
8. **Volume total de linhas de log** — se o normal e 120K e num dia foram 600K, algo esta errado

A chave e: conheca sua media primeiro, depois alerte sobre desvios. Os numeros especificos dependem da sua aplicacao.

## Tracebacks nao vao no log

Stack traces contem codigo-fonte, caminhos de arquivo, e estrutura interna. O instrutor recomenda sistemas que salvam tracebacks em pasta/sistema separado (cita Laravel e Py4Web como exemplos que usam sistema de "tickets" para tracebacks).