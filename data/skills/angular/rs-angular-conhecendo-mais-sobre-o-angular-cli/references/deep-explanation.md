# Deep Explanation: Angular CLI — Geracao de Artefatos

## CLI Global vs Local — Por que isso importa

O instrutor enfatiza repetidamente a diferenca entre CLI global e local porque e fonte comum de confusao:

- **Global (`npm i -g @angular/cli`):** Quando voce digita `ng` no terminal, o sistema operacional busca o binario nas bibliotecas globais da maquina. Funciona em qualquer pasta/projeto.
- **Local (dentro do projeto):** Cada projeto Angular tem sua propria versao do CLI em `node_modules`. O script `ng` no `package.json` aponta para essa versao local.

### Cenario real explicado pelo instrutor

Imagine 3 projetos:
- Projeto 1: Angular 15
- Projeto 2: Angular 19
- Projeto 3: Angular 20

Ao usar `ng generate` com CLI global (ex: versao 19), voce usa a mesma versao 19 para gerar artefatos em todos os projetos. Isso geralmente funciona, mas pode haver incompatibilidades.

A alternativa segura e usar `npm run ng` que sempre usa o CLI local do projeto, garantindo compatibilidade de versao.

### Recomendacao do instrutor

- Tenha o CLI global instalado (versao 19 ou 20) para conveniencia
- Para criar **novos projetos** com versao especifica, use `npx @angular/cli@versao new projeto`
- Para gerar artefatos **dentro** de projetos existentes, `ng generate` global funciona bem na maioria dos casos

## Como o CLI resolve paths

Quando voce executa `ng g c comp-1` na raiz do projeto, o CLI automaticamente:
1. Identifica que esta dentro de um projeto Angular (pelo `angular.json`)
2. Resolve o path para `src/app/comp-1/`
3. Cria a pasta e todos os arquivos

Voce **nao precisa** especificar `src/app/` — o CLI faz isso automaticamente.

Para services em subpastas: `ng g s services/user` cria em `src/app/services/user.service.ts`.

## Flags e opcoes

Cada tipo de artefato tem suas proprias opcoes. O instrutor recomenda ler a documentacao mesmo para flags que voce nao usa, porque:
- `--flat` — nao cria subpasta (util para services simples)
- `--inline-style` — CSS inline no componente
- `--inline-template` — HTML inline no componente
- `--skip-tests` — nao gera arquivo `.spec.ts`

Referencia: https://angular.dev/cli (CLI Reference)

## Sufixo automatico

O CLI concatena automaticamente o sufixo do tipo:
- `ng g c header` → cria `header.component.ts`, classe `HeaderComponent`
- `ng g s user` → cria `user.service.ts`, classe `UserService`

Por isso, nunca passe o sufixo no nome — `ng g c header-component` geraria `header-component.component.ts` (redundante).