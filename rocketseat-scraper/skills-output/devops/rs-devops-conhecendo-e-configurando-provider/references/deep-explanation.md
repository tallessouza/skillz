# Deep Explanation: Terraform Provider GCP

## Por que repositorios separados por provedor?

O instrutor enfatiza que mesmo o Terraform suportando multiplos provedores num unico repositorio, a organizacao fica confusa. A modularizacao se torna mais dificil e o gerenciamento organizacional mais complexo. A excecao seria um caso muito especifico de multi-cloud, mas mesmo assim a recomendacao e separar.

A analogia implicita e de responsabilidade unica: cada repositorio tem um contexto claro (um provedor), assim como cada arquivo tem uma responsabilidade (providers.tf configura, main.tf declara recursos).

## GCP e orientado por projeto

Diferente da AWS onde voce trabalha com contas, o GCP e orientado por projeto. Cada projeto:
- Tem um nome legivel (ex: "Rocketseat")
- Tem um ID unico gerado automaticamente (ex: "rocketseat-438714")
- Agrupa todos os recursos de nuvem
- Pode representar uma squad, um ambiente (staging/prod), etc.
- Tem cota (ate ~10 projetos no free tier)

O ID e o que deve ser usado no Terraform porque garante unicidade. O nome pode ser duplicado.

## Hierarquia de disponibilidade

O instrutor explica a hierarquia de forma clara:

1. **Multi-AZ (zonas de disponibilidade)** — recurso disponivel em multiplas zonas dentro de uma regiao. Caso mais comum e suficiente para maioria dos cenarios.
2. **Multi-Region** — recurso disponivel em varias regioes. Caso mais especifico.
3. **Multi-Cloud** — recurso disponivel em multiplos provedores. Caso muito especifico.

A recomendacao e comecar com multi-AZ e so escalar para multi-region ou multi-cloud quando houver caso de uso real.

## Zona no provider vs no recurso

Existem duas abordagens:
- **Zona no provider:** todos os recursos criados serao "zonais" — pertencentes a uma unica zona. Mais simples, menos flexivel.
- **Zona no recurso:** o provider define apenas a regiao, e cada recurso define sua zona. Mais flexivel, permite recursos em zonas diferentes.

O instrutor recomenda a segunda abordagem para maior flexibilidade.

## Free tier do GCP

Similar a AWS, o GCP oferece:
- Cota de uso gratuito anualmente
- Cobranca apenas ao exceder a cota
- Bonificacao no primeiro ano
- Ideal para estudo e experimentacao

Acesso via `console.cloud.google.com` vinculando conta Google/Gmail.

## Estrutura de arquivos recomendada

```
primeiro-projeto-iac-gcp/
├── providers.tf    # Configuracao do provider Google
└── main.tf         # Declaracao de recursos
```

Poderia ter tambem `variables.tf` e `terraform.tfvars` para modularizacao, mas para aprendizado inicial o instrutor prefere hardcoded values para manter simplicidade.

## Compute Instance — campos importantes

| Campo | Obrigatorio | Descricao |
|-------|-------------|-----------|
| `name` | Sim | Nome da VM |
| `machine_type` | Sim | Tipo/tamanho (e2-micro, e2-small, etc.) |
| `zone` | Sim* | Zona de disponibilidade (*pode vir do provider) |
| `boot_disk` | Sim | Disco de inicializacao com imagem |
| `network_interface` | Sim | Interface de rede (pode usar "default") |
| `tags` | Nao | Boa pratica para organizacao |
| `scratch_disk` | Nao | Disco adicional efemero |
| `metadata` | Nao | Metadados da instancia |