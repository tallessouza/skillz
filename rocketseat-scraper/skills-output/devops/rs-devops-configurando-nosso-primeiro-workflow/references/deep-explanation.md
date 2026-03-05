# Deep Explanation: Configurando Primeiro Workflow no GitHub Actions

## Por que o GitHub Actions nao precisa de configuracao extra

O GitHub Actions e nativo do GitHub. Qualquer repositorio (publico ou privado) ja tem a aba Actions disponivel. Nao precisa instalar nada, configurar servidor de CI, ou conectar servicos externos. Essa e a grande vantagem: zero setup de infraestrutura.

## Custo e cotas — o asterisco importante

O instrutor faz um disclaimer importante: repositorios **privados** tem cota menor de minutos gratuitos. Repositorios **publicos** tem uso praticamente ilimitado. Para estudos com repo privado, o impacto e minimo, mas em producao isso importa.

## A hierarquia do YAML

O instrutor enfatiza a estrutura hierarquica:

```
Workflow (name)
  └── Jobs (jobs)
       └── Job individual (build, test, etc.)
            ├── Runner (runs-on)
            └── Steps (steps)
                 ├── Step 1
                 ├── Step 2
                 └── Step N
```

Um workflow pode ter **N workflows** no repositorio (cada arquivo `.yaml` em `.github/workflows/`). Um workflow pode ter **N jobs**. Um job pode ter **N steps**. Steps executam em **serie** (sequencial).

## Por que o `name:` aparece em dois lugares

O instrutor explica que `name:` no topo do arquivo e o nome do **workflow** (aparece na listagem da aba Actions). O `name:` dentro de um job e o nome daquele **job especifico**. Se voce nao passar o name do job, ele usa a key do job (ex: `build`). Com multiplos jobs/workflows, nomes descritivos sao essenciais para organizacao.

## O erro "No event triggers defined in on"

Esse e o erro mais comum ao criar um primeiro workflow. O instrutor demonstra que sem a propriedade `on:`, o GitHub Actions nao sabe **quando** executar o workflow. O VS Code inclusive mostra um warning: "missing property on". O workflow e criado e commitado, mas falha imediatamente na execucao.

## Checkout — por que e necessario

O instrutor usa uma analogia implicita: o runner (maquina Ubuntu) e uma maquina limpa. Ela nao tem seu codigo. Voce precisa explicitamente fazer um "pull" do codigo para dentro daquela execucao. A action `actions/checkout@v4` (mantida pelo proprio GitHub) faz exatamente isso — clona o repositorio na branch correta dentro do runner.

## Criacao pelo GitHub vs localmente

O instrutor mostra que voce pode criar o workflow de duas formas:
1. **Pela interface do GitHub** — clicando em Actions > "set up a workflow yourself"
2. **Localmente** — criando a pasta `.github/workflows/` e o arquivo `.yaml` manualmente

Ambas funcionam identicamente. A interface do GitHub oferece templates pre-prontos, mas para aprendizado o instrutor opta por configurar manualmente.

## GitHub Marketplace para Actions

O instrutor navega ate `github.com/marketplace` para mostrar que actions como `checkout` sao reutilizaveis e versionadas. O `@v4` indica a versao 4 da action. Esse conceito de marketplace e importante — voce nao precisa reinventar steps comuns.