# Deep Explanation: Configurando Targets no Babel

## Por que configurar targets?

O `@babel/preset-env` e um preset inteligente — ele analisa quais navegadores voce quer suportar e aplica apenas as transformacoes necessarias. Sem targets, ele assume um padrao amplo e transforma mais codigo do que o necessario.

Quando voce define targets especificos (ex: Chrome 67+), o Babel sabe que arrow functions, `const/let`, e template literals ja sao suportados nativamente, entao **nao transforma** esse codigo. Resultado: bundle menor e mais rapido.

## A estrutura de array duplo

O Babel usa uma convencao especifica para configurar presets:
- **String simples:** `"@babel/preset-env"` — usa configuracao padrao
- **Array com opcoes:** `["@babel/preset-env", { ...opcoes }]` — permite customizacao

Essa mesma convencao se aplica a plugins. E um padrao do ecossistema Babel que voce vai encontrar em toda documentacao.

## Por que versoes sao strings?

O instrutor Rodrigo destaca que navegadores como Safari usam versoes decimais (`11.1`). Se voce usar numeros JavaScript, `11.1` funcionaria, mas por consistencia e seguranca, o Babel espera strings. Alem disso, versoes como `"11.1.2"` nao sao numeros validos em JS.

## Polyfills e CoreJS

Alem de targets, o preset-env suporta:
- `useBuiltIns: "usage"` — adiciona polyfills automaticamente conforme uso no codigo
- `corejs: 3` — especifica a versao do CoreJS para fornecer polyfills

Polyfills adicionam funcionalidades modernas (como `Promise`, `Array.includes`) para navegadores antigos que nao tem suporte nativo. O instrutor menciona isso como configuracao avancada disponivel na documentacao.

## Separacao de scripts: build vs dev

O instrutor percebe durante a aula que ter apenas um script com `--watch` trava o console. A solucao pratica:
- `npm run build` — compila uma vez e libera o terminal
- `npm run dev` — compila e fica observando mudancas (watch mode)

Essa separacao e um padrao universal em projetos JavaScript, nao apenas com Babel.

## Filosofia do instrutor: configure conforme a necessidade

Rodrigo enfatiza que **nao adianta mostrar todas as propriedades possiveis** porque a configuracao depende do projeto. O importante e:
1. Saber que a configuracao existe
2. Saber onde encontrar na documentacao
3. Configurar quando a necessidade surgir no projeto real

Essa abordagem pragmatica evita over-engineering e configuracoes copiadas sem entendimento.

## Documentacao como fonte de verdade

O instrutor mostra que tira as propriedades da documentacao oficial do Babel (babeljs.io), especificamente na secao "Usage Guide". Ele recomenda sempre consultar porque:
- Propriedades mudam entre versoes
- Algumas opcoes deixam de existir
- Novas opcoes sao adicionadas