# Deep Explanation: Definindo Roteamento com Gateway API

## Hierarquia do Gateway API

O instrutor explica que o Gateway API funciona como uma cascata hierarquica:

1. **Gateway** — a borda, o ponto de entrada. Sozinho, sem HTTPRoutes, retorna 404 para qualquer requisicao porque nao sabe para onde mandar o trafego.
2. **HTTPRoute** — filho do Gateway (definido via `parentRefs`). Contem as regras de match e os destinos (backendRefs).
3. **Service** — o backend final que recebe o trafego quando ha match.

O Gateway "olha para" os HTTPRoutes registrados nele. Se houver match no path, encaminha para o Service. Sem match, 404.

## Por que arquivos separados?

O instrutor menciona que voce *pode* usar `---` (tres hifens) para criar multiplos documentos YAML no mesmo arquivo. Porem, ele pessoalmente evita isso por questao de **segregacao de responsabilidade**. Se a configuracao do HTTPRoute for muito pequena, pode fazer sentido juntar, mas em geral, arquivos separados sao preferidos.

## Exact match vs Prefix match

O instrutor usa `type: Exact` propositalmente. Quando configurou `/healthz` como Exact:
- `GET /healthz` → match, redireciona ao service
- `GET /healthz/` → **nao** faz match (nao eh exato)
- `GET /redis` → **nao** faz match (nao esta declarado)

Ele demonstra isso ao vivo: mudou o path para `/ralph` e tentou acessar `/ralph` — funcionou (chegou ao Node que deu 404 porque a app nao tem essa rota). Isso prova que o routing do gateway funciona, mas a aplicacao precisa ter a rota correspondente.

## O ponto sobre LoadBalancer vs ClusterIP

O instrutor ressalta que ao criar um Gateway, por padrao pode ser criado um LoadBalancer (IP externo). Nem sempre isso eh desejado — as vezes voce quer apenas um servico interno (ClusterIP). Isso eh controlado pelo **gatewayClassName**, que sera explorado na proxima aula.

## Teste de carga pelo Gateway

O instrutor mostra que ao rodar teste de carga apontando para o Gateway (em vez de direto no Service), o Kiali mostra o fluxo completo: Gateway → Service → v1/v2 (distribuicao randomica). Isso confirma que o trafego esta passando pela borda e nao mais indo direto ao service.

## Visualizacao no Kiali

Antes do HTTPRoute, o Gateway aparecia "solto" no Kiali — sem relacao com nenhum servico. Apos aplicar o HTTPRoute, o Traffic Graph mostra a cadeia completa de roteamento. O instrutor nota que o Kiali nao mostra Virtual Service/Destination Rule para o Gateway — algo que sera explorado mais adiante.