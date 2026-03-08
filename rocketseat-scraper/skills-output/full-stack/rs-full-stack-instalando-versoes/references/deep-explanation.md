# Deep Explanation: Instalando Versões com NPM

## A diferença entre "versão mais atual" e "versão latest"

O instrutor destaca um ponto que confunde muitos desenvolvedores: quando você executa `npm i express`, o npm **não** instala necessariamente a versão com o número mais alto no registry. Ele instala a versão marcada com a **tag `latest`**.

No exemplo da aula, a versão mais recente publicada do Express era a 5.0.1, mas ela tinha a tag `next` — indicando que é a "próxima" versão, ainda não considerada estável para uso geral. A tag `latest` apontava para a 4.21.1, que é a versão estável usada pela maioria.

### Como funcionam as tags no npm

Quando um mantenedor publica um pacote, ele pode associar tags:
- **`latest`** — padrão, é o que `npm i pacote` instala. Representa a versão estável.
- **`next`** — convenção para a próxima major version em desenvolvimento/preview.
- **`beta`**, **`alpha`**, **`rc`** — outras tags comuns para pré-releases.

O comando `npm view express dist-tags` mostra todas as tags e suas versões associadas.

## O papel do package-lock.json

O instrutor menciona que o package-lock.json "ajuda a gerenciar a compatibilidade". Na prática, ele:

1. **Fixa versões exatas** de todas as dependências (diretas e transitivas)
2. **Garante reprodutibilidade** — qualquer pessoa que rode `npm i` no projeto instala exatamente as mesmas versões
3. **Só aparece** quando o projeto tem pelo menos uma dependência instalada

### Por que rodar `npm i` sem argumentos?

Quando você modifica o package.json manualmente (trocando número de versão, por exemplo), o package-lock.json fica dessincronizado. Rodar `npm i` sem argumentos faz o npm:
1. Ler o package.json
2. Resolver as versões conforme os ranges especificados
3. Atualizar o package-lock.json para refletir o estado real
4. Instalar/atualizar pacotes em node_modules conforme necessário

O instrutor enfatiza essa prática como "dica importante" — especialmente após trocas manuais de versão como foi demonstrado na aula.

## A pasta node_modules

A pasta node_modules não existe em um projeto novo até que a primeira dependência seja instalada. Isso é normal e esperado. O instrutor mostrou que antes de rodar `npm i express`, a pasta simplesmente não existia no projeto.

Essa pasta contém:
- O pacote instalado (ex: express)
- Todas as dependências transitivas do pacote
- Nunca deve ser commitada no git (deve estar no .gitignore)

## Instalação para frente e para trás

O instrutor demonstra que o `@versão` funciona em qualquer direção:
- **Para frente:** `npm i express@5.0.1` — versão mais nova que a atual
- **Para trás:** `npm i express@3.19.0` — versão muito mais antiga

Quando você instala uma versão diferente, o npm:
1. Remove a versão anterior do node_modules
2. Instala a nova versão solicitada
3. Atualiza package.json com a nova versão
4. Atualiza package-lock.json para manter consistência

Isso é útil para:
- **Debugging:** reproduzir um bug que só ocorre em versão específica
- **Compatibilidade:** projeto legado que precisa de API antiga
- **Testing:** verificar se o código funciona com a próxima major version