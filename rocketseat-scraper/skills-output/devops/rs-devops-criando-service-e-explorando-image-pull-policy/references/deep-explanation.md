# Deep Explanation: Kubernetes Service e imagePullPolicy

## Por que ClusterIP e o padrao correto

O ClusterIP cria um IP interno no cluster que funciona como ponto de acesso para os pods. A diferenca fundamental em relacao ao port-forward direto para um pod e que o Service distribui trafego entre multiplos pods. Quando voce faz port-forward para um pod, e uma conexao 1:1. Quando faz para um Service, ele roteia para todos os pods que correspondem ao selector.

Na arquitetura real, o Service ClusterIP fica atras de um Ingress, que e a camada que realmente expoe a aplicacao para o mundo externo. Por isso a porta 80 no Service — ele representa o ponto de acesso "como se fosse" o usuario final.

## O problema da tag reutilizada (analogia com latest)

O instrutor faz um teste proposital: builda uma nova versao do codigo mas mantem a tag `v1`. No Docker Hub, isso resulta em um **replace silencioso** — a tag v1 agora aponta para uma imagem diferente, mas nao ha historico disso.

Isso e exatamente o mesmo problema da tag `latest`: ela e constantemente sobrescrita e voce perde todo o lastro. O instrutor destaca que voce nao consegue:
- Fazer rollback para a versao anterior (porque a tag foi sobrescrita)
- Saber qual commit corresponde a qual versao
- Auditar o que mudou entre deploys

## imagePullPolicy: as tres opcoes

### `Always`
O Kubernetes sempre faz download da imagem, mesmo que ela ja exista no no. Util para desenvolvimento, mas **quebra o principio de imutabilidade** porque permite que tags sobrescritas sejam recarregadas silenciosamente.

### `IfNotPresent`
So faz download se a imagem nao existir no no. Isso forca o padrao correto: se voce quer deployar codigo novo, precisa de uma tag nova. A imagem v1 ja existe? Entao ela nao sera rebaixada. Quer uma versao nova? Crie v2.

### `Never`
Nunca faz download. A imagem precisa ja estar presente no no. Uso muito especifico e raro.

## O fluxo de CI/CD manual demonstrado

O instrutor faz o fluxo completo na mao para mostrar cada etapa:

1. **Alteracao no codigo** — nova rota `/example-k8s`
2. **Build** — `docker build -t usuario/app:v1 .`
3. **Push** — `docker push usuario/app:v1`
4. **Apply** — `kubectl apply -f k8s/ -n primeira-aplicacao`

O ponto critico: como a tag e a mesma (v1), o Kubernetes so faz o deploy da "nova" imagem se o `imagePullPolicy` for `Always`. Com `IfNotPresent`, ele nem baixaria porque ja tem v1 no cache.

## Por que imutabilidade importa em producao

O instrutor levanta a pergunta chave: "E se essa versao tiver um problema?" Se a tag foi sobrescrita, nao tem como voltar. O rollback do Kubernetes funciona baseado em revisoes do deployment, mas se a imagem apontada pela tag mudou, o rollback vai puxar a mesma imagem "nova" (com bug), porque a tag v1 agora aponta para o codigo novo.

Com tags imutaveis (v1, v2, v3 ou hashes de commit), cada revisao aponta para uma imagem diferente e o rollback funciona corretamente.

## Detalhes do Service YAML

- `apiVersion: v1` — Services usam a API core v1
- `kind: Service` — tipo do objeto
- `metadata.name` — pode usar abreviacoes como `svc` no nome
- `spec.type: ClusterIP` — exposicao interna
- `spec.selector.matchLabels` — deve coincidir com os labels do Deployment
- `spec.ports.port` — porta exposta pelo Service (80)
- `spec.ports.targetPort` — porta do container (3000)

## Apply por pasta vs arquivo

O `kubectl apply -f` aceita tanto um arquivo individual quanto uma pasta inteira. Quando aplica uma pasta, ele processa todos os YAMLs e so altera os que tiveram mudancas. O Service ja existente nao sera reconfigurado se nao houver alteracao no seu YAML.