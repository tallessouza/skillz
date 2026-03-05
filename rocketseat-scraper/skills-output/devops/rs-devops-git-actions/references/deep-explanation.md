# Deep Explanation: GitHub Actions

## Por que GitHub Actions e nao outra ferramenta?

O instrutor destaca que a principal vantagem eh ser **built-in**: ao criar um repositorio no GitHub, a aba Actions ja existe. Isso elimina toda a complexidade de:

1. Configurar uma ferramenta externa do zero
2. Criar integracoes via webhook entre GitHub e o servico de CI
3. Gerenciar autenticacao e permissoes entre dois sistemas

### Analogia com Azure DevOps

O instrutor compara com o Azure DevOps, onde Azure Repos e Azure Pipelines estao na mesma suite. GitHub Actions segue o mesmo principio — repositorio e pipeline no mesmo ecossistema.

### O modelo antigo (pre-GitHub Actions)

Antes do GitHub Actions, o fluxo era:
1. Codigo no GitHub
2. Alteracao gera webhook
3. Webhook dispara CI em servico externo (ex: CircleCI)
4. Servico externo executa pipeline

Com GitHub Actions, o servico eh o mesmo. O webhook existe conceitualmente, mas tudo acontece internamente.

## Modelo de cobranca

- **Free tier:** 2000 minutos/mes
- Cada execucao de pipeline desconta da cota mensal
- Pipeline de 10-20 min por execucao eh normal
- Para estudos, 2000 min eh mais que suficiente
- Otimizacao de pipeline sera tema recorrente no curso (modulos seguintes)

O instrutor enfatiza que otimizacao nao eh so performance — eh tambem **custo**. Pipeline mais rapida = menos minutos consumidos = mais execucoes possiveis.

## Arquitetura conceitual

```
Workflow (YAML)
├── Job 1
│   ├── Action: Checkout
│   ├── Action: Setup ambiente
│   ├── Action: Instalar dependencias
│   └── Action: Rodar testes
└── Job 2
    ├── Action: Build
    └── Action: Deploy
```

### Workflow
- Declarativo em YAML
- Descreve TODO o processo de automacao
- Pode ser para backend, frontend, job, ou ate repositorio de infraestrutura

### Actions
- Tarefas individuais dentro do workflow
- Relacao 1:N (um workflow tem varias actions)
- Muitas actions open source disponiveis no marketplace
- Exemplos: preparar ambiente, instalar deps, testar, buildar

### Runner
- Maquina que executa o workflow
- Configuravel: Ubuntu, outras distros
- Definido declarativamente no YAML

## Controle por branch (conceito-chave)

O instrutor destaca que pipelines podem ser **condicionais por branch**:

- **Branch dev:** roda apenas install + test
- **Branch main:** roda install + test + build + deploy
- **Pull request:** roda CI para validacao antes do merge

Isso permite separar CI de CD naturalmente usando o modelo de branching do Git.

## Triggers disponiveis

O instrutor menciona varios triggers:
- Push (commit em qualquer branch)
- Merge na main
- Pull request
- E outros que serao explorados nas aulas praticas

Tudo configurado no YAML, de forma declarativa e customizavel.

## Contexto no curso

- Esta aula eh teoria/introducao
- Proxima aula: pratica escrevendo YAML e testando no GitHub Actions
- Modulo 5: outra ferramenta de CI/CD para comparacao
- Ao longo do curso: tecnicas de otimizacao de pipeline