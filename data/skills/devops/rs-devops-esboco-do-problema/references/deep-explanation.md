# Deep Explanation: Esboço do Problema — Kubernetes

## Por que containerizar nao e suficiente

O instrutor comeca com um cenario simples: uma aplicacao A containerizada. O ponto central e que ter um container nao resolve o problema — se o container morre, sem orquestracao, voce tem tres problemas:

1. **Nao sabe o motivo** — containers sao efemeros por natureza
2. **Nao sabe quando vai acontecer** — impossivel prever falhas
3. **Nao sabe quem vai recriar** — sem automacao, e manual

E isso com UMA aplicacao. Imagina com dezenas.

## Self-healing (autocura)

O Kubernetes tem um mecanismo chamado **self-healing**. O instrutor usa o termo "self-reliance" mas o conceito oficial e self-healing. O comportamento e:

1. Container apresenta problema
2. Kubernetes **mata o container** (efemeridade como feature, nao bug)
3. Kubernetes **recria o container** automaticamente
4. Aplicacao passa pelo bootstrap novamente
5. Pode resolver ou nao — mas uma acao foi tomada

O instrutor destaca que voce pode alinhar isso com **ChatOps**: receber alertas quando isso acontece para tomar acao caso o restart nao resolva.

**Insight do instrutor:** "A primeira coisa que ele vai fazer e sempre matar o seu container." — Isso e fundamental. O Kubernetes nao tenta consertar. Ele descarta e recria. Por isso a app DEVE ser stateless.

## Replicacao horizontal e isolamento

Quando voce replica horizontalmente (3 pods da mesma app), cada pod e **isolado**. Mesmo rodando a mesma imagem, eles nao compartilham nada. Isso cria uma consequencia importante:

- Se a app salva logs localmente → cada pod tem logs diferentes
- Se a app salva assets localmente → inconsistencia entre replicas

**Solucao do instrutor:** Desacople tudo:
- Assets → S3, Blob Storage
- Logs → Prometheus ou ferramenta de observabilidade
- Assim voce tem um **ponto unico** de observacao para todos os pods

## Recursos computacionais — a conta e simples

O instrutor faz uma conta direta:
- 1 pod = 1GB RAM + 1 vCPU
- 3 replicas = 3GB RAM + 3 vCPUs
- App B com 2 replicas de 512MB + 0.5 vCPU = 1GB RAM + 1 vCPU

Cada aplicacao pode ter recursos diferentes. O controle e granular por pod.

**Nota do instrutor:** Os valores de 1GB e 1 vCPU sao altos e usados apenas como exemplo. Para chegar nos valores reais, voce faz testes de estresse (abordado em aulas futuras).

## Elasticidade com HPA

O fluxo do HPA explicado pelo instrutor:

1. App A roda com 3 replicas (minimo)
2. Condicional: se memoria > 70%, cria nova replica
3. Escala de 3 → 4 → ... → 8 (maximo)
4. Se chegar em 8, nao escala mais → configure alarme
5. Quando trafego reduz e memoria cai abaixo de 70%, volta para 3
6. Reducao = economia de custo

**Analogia implicita do instrutor:** E como um accordeon — expande quando precisa, contrai quando nao precisa. Mais replicas = mais custo, entao a elasticidade economiza.

## Stateless vs Stateful

O padrao no Kubernetes e **stateless**. Se voce precisa de estado:
- **PersistentVolume** — vincula armazenamento persistente ao pod
- **StatefulSet** — recurso especifico para workloads com estado

Mas o instrutor enfatiza: "Via de regra vai ser sempre stateless."

## Terminologia Kubernetes

| Termo | Significado |
|-------|-------------|
| Pod | Menor unidade executavel no Kubernetes (contem 1+ containers) |
| Replica | Sinonimo de pod no contexto de replicacao |
| HPA | Horizontal Pod Autoscaler — escala adicionando/removendo pods |
| VPA | Vertical Pod Autoscaler — escala aumentando recursos do pod |
| Self-healing | Mecanismo de autocura (mata e recria containers) |
| StatefulSet | Recurso para workloads que precisam de estado |
| PersistentVolume | Armazenamento que sobrevive ao ciclo de vida do pod |
| Millicores | Unidade de CPU: 1000m = 1 vCPU |