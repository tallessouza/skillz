# Deep Explanation: Conhecendo o MinIO

## O que e MinIO

MinIO e uma ferramenta open source de **object storage** — armazena blocos de informacao em alta volumetria. O instrutor enfatiza que e compativel com Amazon S3, ou seja, a API, conceitos (buckets, access keys, policies) e a forma de interagir sao praticamente identicos.

## Por que MinIO e nao S3 direto?

- **Open source** — custo zero de licenca
- **Pode rodar em bare metal** — servidor fisico proprio, sem custo de cloud
- **S3-compativel** — qualquer SDK ou ferramenta que funciona com S3 funciona com MinIO
- **Interface web built-in** — console em porta separada (9001) para gerenciar buckets, users, policies

## Analogia com AWS

O instrutor faz paralelo direto:

| MinIO | AWS |
|-------|-----|
| Bucket | S3 Bucket |
| Access Keys | IAM Access Keys |
| Policies (PBAC) | IAM Policies |
| Console web | AWS Console S3 |
| `MINIO_ROOT_USER` | Root account |

## Arquitetura de portas

- **Porta 9000** — API do MinIO (onde aplicacoes como Loki se conectam)
- **Porta 9001** — Console web (interface grafica para gerenciamento)

O instrutor destaca que o `command` do container precisa explicitar ambas via `--address` e `--console-address`.

## Credenciais default

Se nenhuma variavel de ambiente for definida, o MinIO sobe com:
- User: `minioadmin`
- Password: `minioadmin`

O instrutor recomenda sempre sobrescrever via `MINIO_ROOT_USER` e `MINIO_ROOT_PASSWORD`.

## Volume e persistencia

Ponto critico mencionado: sem volume Docker configurado, ao dropar/restartar o container, todos os buckets e dados sao perdidos. No contexto da aula (exploracao), isso e aceitavel. Em qualquer outro cenario, configurar volume e obrigatorio.

## Funcionalidades do console

O instrutor navega pelo console mostrando:
- **Buckets** — criar com opcoes de versionamento, object lock, cota
- **Access Keys** — criar chaves com data de expiracao, descricao, restricoes (estrutura identica ao IAM)
- **Identity** — usuarios, grupos, PBAC (Policy-Based Access Control)
- **Monitoring** — metricas built-in de uso de disco e capacidade
- **Object Browser** — navegar pelos arquivos armazenados

## Contexto no curso

MinIO esta sendo configurado para servir como backend de storage para o **Loki** (sistema de logs). A ideia e descentralizar a responsabilidade de persistencia de logs do container do Loki para o MinIO.