# Deep Explanation: Patch Update

## Por que atualizar de forma progressiva?

O instrutor enfatiza fortemente que atualizações devem ser feitas **de forma progressiva, não tudo de uma vez**. A razão é simples: se você atualiza 20 pacotes simultaneamente e algo quebra, você não sabe qual pacote causou o problema. Atualizando por grupo (patch → minor → major), você isola a causa.

### Analogia do semáforo

Patch updates são como trocar uma lâmpada queimada no semáforo — o semáforo continua funcionando igual, só corrigiu um defeito. Minor seria adicionar um timer ao semáforo. Major seria mudar o semáforo para uma rotatória — muda o comportamento completamente.

## Semver e os três números

No versionamento semântico (`MAJOR.MINOR.PATCH`):

- **PATCH** (terceiro número): correções de bug. Não muda API, não adiciona funcionalidade. Risco mais baixo de quebra.
- **MINOR** (segundo número): novas funcionalidades backwards-compatible. Risco médio.
- **MAJOR** (primeiro número): breaking changes. Risco alto, pode exigir mudanças no código.

O `npm-check-updates` agrupa por esses tipos e, por segurança, já traz as major desabilitadas por padrão. O instrutor comenta: "Olha só, ele já trouxe a major desabilitada. Meio como tipo, olha, tem certeza?"

## O papel do modo interativo

O flag `--interactive` do ncu permite selecionar individualmente quais pacotes atualizar. Combinado com `--format group`, ele agrupa visualmente por tipo de atualização, facilitando a decisão.

Navegação:
- **Seta cima/baixo**: navegar entre pacotes
- **Barra de espaço**: marcar/desmarcar pacote
- **Enter**: confirmar seleção
- **Y**: aceitar instalação

## Testando após atualização

O instrutor demonstra um fluxo completo de teste:

1. Roda a aplicação (`npm run dev`)
2. Verifica aba "Problems" do VS Code — se houver erro de tipo, os arquivos ficam vermelhos
3. Cria um usuário novo no Insomnia
4. Faz login (cria sessão)
5. Tenta operações protegidas (listar entregas, ver status)
6. Abre Prisma Studio para verificar/modificar dados no banco
7. Testa como diferentes perfis (vendedor vs. cliente)

Esse fluxo garante que as dependências atualizadas não quebraram autenticação, autorização, CRUD, ou tipagens.

## Por que pacotes @types aparecem no patch?

Pacotes como `@types/jest` e `@types/jsonwebtoken` são definições de tipo para TypeScript. Patches nesses pacotes corrigem definições incorretas de tipo. Embora não afetem o runtime, podem causar erros de compilação se houver tipos incorretos.

## Verificação final

Após instalar os patches, o instrutor roda `npx npm-check-updates --format group` novamente sem modo interativo, apenas para visualizar. O resultado mostra que o grupo patch desapareceu — todas as correções de bug foram aplicadas. Restam apenas minor e major, que serão tratados nas próximas aulas.

Essa verificação é importante para confirmar que o ciclo de patch está completo antes de avançar para o próximo grupo.