# Deep Explanation: Versionamento Semântico

## O raciocínio por trás do padrão

O instrutor enfatiza que versionamento semântico existe para **comunicar** o impacto de mudanças. Não é apenas um número incremental — é uma linguagem entre mantenedores de bibliotecas e desenvolvedores que as consomem.

### A analogia da timeline

O instrutor usa a metáfora de uma **timeline**: cada biblioteca tem sua vida ao longo do tempo, sofrendo atualizações continuamente. Isso é normal e esperado. As atualizações existem para:
- Trazer novas funcionalidades
- Corrigir bugs
- Melhorar eficiência

A mensagem é: **não se atavore** com atualizações. Elas são parte natural do ciclo de vida de qualquer dependência.

## Os três números em profundidade

### MAJOR (primeiro número)
- **Significado:** Mudanças significativas que podem afetar a funcionalidade da aplicação
- **Risco:** Pode causar problemas de compatibilidade com a versão anterior
- **Termo técnico:** Breaking change
- **Ação necessária:** Sempre verificar se a versão que você está trazendo para o projeto tem breaking changes — ela pode **quebrar** a aplicação
- **Insight do instrutor:** "Sempre fique muito atento, muito atento se você for atualizar uma versão... confere se a versão que você está tentando trazer tem breaking change"

### MINOR (segundo número)
- **Significado:** Novas funcionalidades adicionadas de maneira compatível
- **Risco:** Baixo — respeita a compatibilidade com a versão MAJOR atual
- **Relação:** Cada MINOR está "conectada" ao seu MAJOR — funcionalidades novas dentro do contrato existente

### PATCH (terceiro número)
- **Significado:** Correções de bugs ou pequenas melhorias
- **Risco:** Nenhum em teoria — não afeta compatibilidade com versões anteriores
- **Frequência:** Geralmente o número que mais muda

## Por que isso importa na prática

O instrutor destaca que entender semver serve para **julgar, definir e decidir**:
1. Se faz sentido trazer aquela versão para o projeto
2. Qual versão atende melhor ao momento atual do projeto
3. Se a atualização é segura ou requer investigação

## Edge cases e nuances

### Versão 0.x.x
Versões com MAJOR 0 indicam desenvolvimento inicial. A API pode mudar a qualquer momento, mesmo em bumps de MINOR. O semver convencional não garante estabilidade antes do 1.0.0.

### Pre-release tags
Versões como `1.0.0-alpha.1`, `2.0.0-beta.3` ou `1.0.0-rc.1` indicam versões que ainda não são consideradas estáveis para aquele release. Não usar em produção.

### Build metadata
O sufixo após `+` (ex: `1.0.0+build.123`) é metadata de build e não afeta a precedência de versão. É ignorado na comparação de versões.

### Ranges no package.json
- `^1.12.7` — aceita MINOR e PATCH (>= 1.12.7 e < 2.0.0)
- `~1.12.7` — aceita apenas PATCH (>= 1.12.7 e < 1.13.0)
- `1.12.7` — versão exata, sem range

O `^` (caret) é o padrão do npm ao instalar e permite atualizações MINOR + PATCH, o que é seguro na maioria dos casos segundo o contrato semver.