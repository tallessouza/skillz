# Deep Explanation: Regras de Roteamento no Istio Virtual Service

## Por que roteamento na malha e nao na aplicacao?

O grande ponto destacado pelo instrutor: **a aplicacao nao precisa ficar sabendo** das regras de roteamento. Toda configuracao de borda fica no Virtual Service e Destination Rule, permitindo:

- Padronizacao de URLs sem deploy de nova versao da app
- Controle de trafego entre versoes (canary deploy)
- Algoritmos de balanceamento por subset
- Tudo configuravel via YAML sem tocar em codigo

## Hierarquia de rotas no Virtual Service

O Istio respeita uma hierarquia top-down nos blocos `http`. O primeiro match que bater sera usado. Por isso:

1. Rotas com `match` (mais especificas) devem vir **antes**
2. Rota default (sem match) deve ser a **ultima**

No exemplo da aula, `/teste` redireciona para V2 via rewrite, e todo o resto vai para V1.

## URI Match + Rewrite

O mecanismo funciona em dois passos:
1. **Match**: verifica se a URI da requisicao bate com o prefix definido
2. **Rewrite**: substitui a URI antes de encaminhar ao destino

Exemplo: requisicao para `/teste` → reescrita para `/healthz` → encaminhada ao subset V2.

Voce pode ter multiplos prefixes no mesmo match. O instrutor mostrou que `/teste` e `/teste2` podem ambos redirecionar para `/healthz`, ou cada um para um destino diferente.

## Consistencia de trafego (ponto nao resolvido)

O instrutor destacou que no exemplo de canary deploy com weight split, falta garantir que um usuario que caiu na V2 continue na V2. Sem isso, o usuario pode alternar entre versoes a cada request, quebrando a experiencia. A solucao envolve **consistent hashing** (session affinity), que sera abordada em aulas futuras.

## Traffic Policy e Load Balancer

Algoritmos disponiveis no Istio para `simple` load balancer:
- **ROUND_ROBIN**: distribuicao sequencial (default)
- **RANDOM**: distribuicao aleatoria
- **LEAST_CONN**: envia para o destino com menos conexoes ativas — mais performatico dependendo do contexto

### Precedencia de configuracao

```
Subset trafficPolicy > Spec-level trafficPolicy
```

Se voce definir `RANDOM` no nivel da spec e `LEAST_CONN` dentro do subset V2, o V2 usara `LEAST_CONN` e o V1 usara `RANDOM`.

## Relacao com deploy canario

O split de trafego por weight (80/20, 90/10) e um exemplo de **canary deployment**:
1. V1 rodando com 100% do trafego
2. Sobe V2 com 10%
3. Aumenta gradualmente: 20%, 30%, etc.
4. Se houver problema: volta 100% para V1 instantaneamente

Tudo controlado via Virtual Service sem nenhuma alteracao na aplicacao.

## Validacao com Kiali

O instrutor usa o Kiali para validar configuracoes:
- **IstioConfig**: verifica se os manifestos estao validos (sem warnings/errors)
- **Graph**: visualiza o fluxo de trafego em tempo real — qual versao esta recebendo requests
- **Fortio**: ferramenta de teste de carga para validar o comportamento (ex: 500 QPS por 10 segundos)

## Erros comuns de YAML destacados na aula

1. **`subset` fora de `destination`**: deve estar indentado dentro de `destination`, nao no mesmo nivel
2. **Typos em campos YAML**: `subset` escrito errado causa `invalid patch` — YAML nao valida nomes de campo
3. **Indentacao incorreta**: campos desalinhados mudam completamente a semantica do manifesto