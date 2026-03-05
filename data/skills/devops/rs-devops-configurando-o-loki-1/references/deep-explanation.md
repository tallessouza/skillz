# Deep Explanation: Configurando o Loki

## Por que essa estrutura de config

O Loki segue o mesmo padrao dos outros componentes da stack (Grafana, Mimir): arquivo YAML montado em `/etc/loki/` via volume Docker. O instrutor enfatiza que esse padrao e consistente — "classico" — e ja foi feito para todos os outros containers.

## Member List e Ring Balancing

O Loki pode operar de forma replicada, similar a bancos de dados com replicas de leitura e escrita. O conceito de `memberlist` prepara o Loki para distribuicao:

- **`join_members`**: Lista de DNS dos membros do ring. Em single-instance, aponta para si mesmo (`loki`). Em ambiente distribuido, seria `loki-read` e `loki-write`.
- **Ring balancing**: Quando ha carga distribuida, o Loki usa o ring para balancear. Precisaria de um ingress (Nginx, etc) na frente para distribuir requests.
- **Analogia do instrutor**: "Muito parecido com banco de dados — replica de leitura, replica de escrita. Muito comum quando trabalha com CQRS."

O `dead_node_reclaim_time`, `gossip_to_dead_nodes_time` e demais configs do memberlist sao defaults para manter o ring saudavel. O que importa de fato e o `join_members`.

## Schema Config

- **`from`**: Data a partir da qual esse schema se aplica. Permite migracoes graduais de schema.
- **`store: tsdb`**: Time Series Database — formato otimizado para dados temporais.
- **`object_store: s3`**: Onde os chunks de log sao armazenados.
- **`schema: v13`**: Versao do schema do Loki.
- **`index.prefix` e `index.period`**: Configuracao para indices futuros. Mesmo sem usar agora, deixa preparado.

## Storage S3 (MinIO)

O MinIO e 100% compativel com S3 da AWS. A unica diferenca para producao seria:
1. Mudar o `endpoint` para o da AWS
2. Ajustar autenticacao
3. Remover `insecure: true`

### Seguranca de Access Keys

O instrutor destaca uma boa pratica importante: **escopar access keys por bucket**. Ao inves de uma key com acesso total, criar keys restritas:
- Uma key so acessa `loki-data`
- Outra so acessa `loki-rule`

"Voce pode controlar o acesso de maneira bem simples ao bucket que voce quer ou nao permitir o acesso."

## `discover_log_levels: false`

Essa config controla se o Loki tenta detectar automaticamente o nivel do log (info, warn, error). O instrutor desligou propositalmente para demonstrar o efeito — logs aparecem "cinzinhas" no Grafana sem classificacao. Posteriormente sera ligado para ver a diferenca.

## Hierarquia de Configuracao (Common vs Secoes)

O bloco `common` define configuracoes compartilhadas. Secoes especificas (como `ruler`) herdam do `common` e podem sobrescrever valores individuais:

- `ruler.storage.s3.bucketnames: loki-rule` sobrescreve o bucket, mas herda endpoint, credenciais, etc do `common`.
- Se passar `access_key_id` no ruler, ele prevalece sobre o do common (hierarquia de prevalencia).

## Race Condition com MinIO

Problema classico: Loki sobe antes do MinIO estar pronto, causando erro de `send request`. Solucoes:
1. `docker restart loki` (rapido, manual)
2. `depends_on` com health check (correto para producao)

O instrutor nota: "Isso e bem comum que aconteca. Nao quer dizer que tenha sido isso, mas e bem possivel."

## `config.expand-env=true`

Flag que permite interpolacao de variaveis de ambiente dentro do YAML do Loki. Sem ela, `${VAR}` causa erro. O instrutor menciona que isso vale para outros containers tambem — se voce quiser usar env vars nos configs, precisa dessa flag.