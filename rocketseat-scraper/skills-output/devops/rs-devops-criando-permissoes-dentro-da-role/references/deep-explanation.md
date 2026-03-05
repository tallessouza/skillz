# Deep Explanation: Criando Permissoes na Role para ECR

## Por que Inline Policy e nao Attach Policy?

O instrutor explica que existem duas opcoes ao adicionar permissoes: **Attach Policies** (policies gerenciadas pela AWS) e **Create Inline Policy** (policy customizada escrita por voce). A escolha pela Inline Policy e estrategica:

1. **Policies gerenciadas sao genericas** — Read Only e restritiva demais (so leitura), Full Access e permissiva demais (tudo liberado), Power User e quase full
2. **Inline Policy permite granularidade** — voce declara exatamente quais actions precisa, nem mais nem menos
3. **Reutilizacao futura** — o instrutor menciona que a mesma abordagem sera usada para o AppRunner, entao ja estabelece o padrao com inline

## Niveis de permissao ECR (analise do instrutor)

| Policy | Problema |
|--------|----------|
| **ReadOnly** | So leitura, nao permite push de imagens |
| **PowerUser** | Quase full, permite upload e alteracao, mas pode ser demais |
| **FullAccess** | `ecr:*` em tudo — "muito nao restritiva, muito ampla" |
| **Inline (custom)** | Exatamente o que precisa: Get para leitura + Put/Upload para envio |

## Dica do instrutor: Console primeiro, Terraform depois

> "Esta com alguma duvida sobre criar um role? Da uma olhada aqui dentro da propria AWS ou na documentacao e depois joga isso la no IAC. Vai economizar ali um tempo."

Essa abordagem e pragmatica: a console AWS mostra visualmente a estrutura do JSON de policies, facilitando entender o formato antes de codificar no Terraform.

## ECR: Mutabilidade de tags

O instrutor explica uma nuance importante:

- **IMMUTABLE**: uma tag nao pode ser sobrescrita — se voce tem `v1.0.0`, nao pode fazer push de outra imagem com a mesma tag. Precisa criar `v1.0.1`.
- **MUTABLE** (default): permite sobrescrever tags, necessario quando se usa `latest` porque a cada push a `latest` precisa apontar para a nova imagem.

A recomendacao ideal e IMMUTABLE com tags versionadas, mas como o curso trabalha com `latest`, mantem-se MUTABLE por praticidade.

## Scan on Push

> "Toda vez que a gente tiver um novo push, ele vai escanear em busca de alguma vulnerabilidade."

Essa configuracao e uma camada de seguranca automatica que analisa a imagem Docker em busca de CVEs conhecidas toda vez que uma nova imagem e enviada ao repositorio.

## Erro de id-token: permissions

O instrutor propositalmente deixou a pipeline falhar para demonstrar o erro. Sem a declaracao `permissions: id-token: write` no workflow do GitHub Actions, o OIDC nao consegue gerar o token necessario para assumir a role na AWS.

A correcao:
```yaml
permissions:
  id-token: write    # permite gerar o token OIDC
  contents: read     # permite ler o conteudo do repositorio
```

## Analogia: ECR vs Docker Hub

O instrutor faz uma comparacao direta:
- Docker Hub: repositorio publico com tags de imagem
- ECR: mesma estrutura, mas privado, dentro da AWS
- Cada "ponte de codigo" (projeto) teria seu proprio repositorio ECR

## Resource "*" vs ARN especifico

O instrutor menciona que `Resource: "*"` aplica as permissoes a qualquer repositorio ECR da conta. Para maior seguranca, pode-se substituir pelo ARN de um repositorio especifico. Mas para simplificar no curso, usa-se wildcard.