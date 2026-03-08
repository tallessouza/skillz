# Deep Explanation: Minor Update de Dependências

## Por que atualizar de forma progressiva?

O instrutor Rodrigo enfatiza uma abordagem incremental: primeiro patch, depois minor, depois major. A razão é controle de risco. Cada nível de semver tem um contrato diferente:

- **Patch (x.x.PATCH):** Correções de bugs. Risco mínimo.
- **Minor (x.MINOR.x):** Novas funcionalidades, sem quebras. Risco baixo, mas pode introduzir comportamentos novos.
- **Major (MAJOR.x.x):** Breaking changes. Risco alto, pode exigir mudanças no código.

Ao agrupar por tipo (`--format group`), o npm-check-updates organiza visualmente essas categorias, permitindo que você atue em cada nível separadamente.

## O modo interativo como safety net

O flag `--interactive` transforma a atualização de uma operação cega em uma operação consciente. Você vê exatamente:

- De qual versão está saindo (ex: 5.19.1)
- Para qual versão vai (ex: 5.22.0)
- Qual o nível da mudança (patch, minor, major)

O instrutor destaca que o npm-check-updates usa **cores diferentes** para indicar o nível de mudança — por exemplo, minor aparece destacada mostrando que traz funcionalidades novas além de bug fixes.

## A inspeção visual pós-update

O Rodrigo menciona explicitamente que gosta de "dar uma passeada pelos arquivos" mesmo sabendo que é um processo manual. A razão: o editor pode mostrar erros de tipo, imports quebrados ou warnings que só aparecem quando você abre o arquivo. É uma verificação complementar aos testes automatizados.

Essa abordagem pragmática reflete experiência real — nem todo problema aparece em testes. Às vezes um tipo mudou, uma interface foi estendida, ou um default foi alterado. A inspeção visual pega esses casos.

## Verificação com requests reais

Após a inspeção visual, o instrutor testa a aplicação com o Insomnia fazendo operações reais:
- Listar entregas
- Atualizar status de uma entrega
- Consultar logs

Isso valida que o runtime está funcionando, não apenas a compilação. Uma dependência atualizada pode compilar corretamente mas falhar em runtime por mudança de comportamento.

## O projeto como contexto

O instrutor comenta "nossa, a gente desenvolveu um projeto grande" ao navegar pelos arquivos — o projeto tem muitos arquivos e dependências, o que torna a atualização progressiva ainda mais importante. Em projetos grandes, atualizar tudo de uma vez é receita para dor de cabeça.

## Fluxo completo recomendado

1. **Patch first** — menor risco, maior volume
2. **Minor second** (esta aula) — funcionalidades novas, risco controlado
3. **Major last** — uma dependência por vez, com testes dedicados
4. **Verificar após cada nível** — não acumular mudanças sem validar