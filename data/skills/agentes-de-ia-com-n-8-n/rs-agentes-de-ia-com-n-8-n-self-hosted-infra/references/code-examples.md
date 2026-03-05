# Code Examples: Self-hosted Infra para N8N

## Nota sobre esta aula

Esta aula e predominantemente visual/navegacional (interface web), nao contem codigo propriamente dito. Os "exemplos" aqui sao os fluxos de configuracao.

## Fluxo de navegacao na documentacao

```
n8n.io → GitHub → Documentation → Hosting N8N → Server Setups
```

Provedores com guia oficial:
- DigitalOcean
- Heroku
- Hetzner
- AWS
- Azure
- GCP

## Configuracao de VPS na Hostinger

### Selecao de plano

```
Planos disponiveis (referencia, precos mudam):
- KVM1: entrada (recursos limitados)
- KVM2: recomendado pelo instrutor (custo-beneficio)
- KVM4+: para escalar depois
```

### Selecao de sistema operacional

```
Opcoes:
1. Sistema operacional puro (Linux) → gerenciamento via CLI
2. OS com painel → selecionar EasyPanel ← RECOMENDADO

Fluxo:
Escolher plano → Escolher periodo → Sistema Operacional → OS com painel → EasyPanel → Confirmar
```

## Estrutura do painel pos-configuracao

```
Hostinger Dashboard
└── Meus Servidores
    └── [Seu Servidor VPS]
        ├── Detalhes do servidor
        ├── Metricas
        │   ├── CPU
        │   ├── Memoria
        │   └── Atividade
        ├── Configuracoes
        │   ├── Backup
        │   ├── Sistema operacional
        │   └── ...
        └── EasyPanel (Gerenciar Painel) ← AQUI
            └── [Interface EasyPanel]
                ├── Servicos rodando
                ├── Instalar novo servico
                └── Configuracoes
```

## Checklist de verificacao pos-setup

```bash
# Verificar que o servidor esta acessivel
# (feito via painel da Hostinger, nao via CLI)

# No painel Hostinger:
# 1. Servidor aparece na lista? ✓
# 2. Status: ativo? ✓
# 3. Metricas de CPU/memoria visiveis? ✓
# 4. Botao "Gerenciar Painel" do EasyPanel disponivel? ✓

# No EasyPanel:
# 1. Login automatico funcionando? ✓
# 2. Interface carregou? ✓
# 3. Pronto para instalar servicos? ✓
```

## Comparativo de abordagens

```
Abordagem 1: CLI puro
+ Controle total
- Manutencao complexa
- Debugging dificil ("um parto")
- Requer conhecimento Linux avancado

Abordagem 2: Painel tecnico (ex: outros paineis)
+ Instalacao facil (clicar opcao 1, 2)
- Problemas dificeis de resolver
- Linha de comando necessaria para debug

Abordagem 3: EasyPanel (recomendado)
+ Instalacao facil
+ Manutencao facil
+ Interface visual completa
+ Pode mudar de painel depois
- Custo do servidor (mas e barato)
```