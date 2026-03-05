# Code Examples: O que e Analise de Dados

## Nota sobre esta aula

Esta aula e 100% conceitual — nao contem exemplos de codigo. E a primeira aula da formacao, focada em estabelecer fundamentos antes de entrar em ferramentas tecnicas (Python, SQL, banco de dados).

## Modelos mentais em formato estruturado

### Ciclo de valor dos dados (rede social)

```
Coleta de dados do usuario
    → Armazenamento (custo alto)
        → Analise de comportamento
            → Recomendacao personalizada
                → Mais tempo na plataforma
                    → Mais propaganda exibida
                        → Mais receita
                            → Justifica o custo de coleta
```

### Fluxo do trabalho do analista

```
Dados historicos (ex: resultados de vendas)
    → Analista avalia os dados
        → Identifica padroes (ex: queda de vendas em mes X)
            → Gera hipoteses (ex: desconto mal recebido?)
                → Comunica insights para executivo
                    → Executivo toma decisao informada
```

### Distribuicao de tempo (regra 80/20)

```
|████████████████████████████████████████| 80% - Coleta, limpeza, tratamento, validacao
|██████████|                              20% - Analise, visualizacao, insights, modelos
```

### Comparacao de profissoes

```
         Mais perto do NEGOCIO
              ▲
              │
    ┌─────────────────┐
    │  ANALISTA DE     │  Olha o passado
    │  DADOS           │  "O que aconteceu?"
    └─────────────────┘
              │
    ┌─────────────────┐
    │  CIENTISTA DE    │  Prediz o futuro
    │  DADOS           │  "O que vai acontecer?"
    └─────────────────┘
              │
    ┌─────────────────┐
    │  ENGENHEIRO DE   │  Constroi a infraestrutura
    │  DADOS           │  "Como o dado chega ate voce?"
    └─────────────────┘
              │
              ▼
         Mais perto do DADO BRUTO
```

### Aplicacoes por setor (exercicio expandido)

```
Setor           │ Dados coletados              │ Insight gerado                    │ Acao do executivo
────────────────┼──────────────────────────────┼───────────────────────────────────┼──────────────────────
Rede social     │ Tempo de tela, interacoes    │ Usuario engaja mais com video X   │ Priorizar formato X
Banco           │ Historico de transacoes      │ Cliente com perfil de fraude      │ Bloquear transacao
Agro            │ Clima, solo, colheitas       │ Melhor janela de plantio          │ Antecipar plantio
Fast fashion    │ Vendas por SKU               │ Peca A vende 3x mais que B       │ Aumentar producao de A
Hospital        │ Prontuarios, exames          │ Correlacao sintoma-diagnostico    │ Protocolo mais rapido
```