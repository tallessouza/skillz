# Deep Explanation: Instalação e Configuração do ContentLayer

## O que é o ContentLayer

O ContentLayer é uma **ponte** entre arquivos Markdown e o projeto Next.js. Ele transforma arquivos `.md` em dados tipados que podem ser consumidos como se fossem qualquer outro módulo TypeScript. A integração com TypeScript é um dos principais diferenciais — os campos definidos no schema geram tipos automaticamente.

## Por que usar ContentLayer em vez de ler Markdown manualmente

Sem ContentLayer, você precisaria:
1. Ler arquivos do filesystem com `fs.readFileSync`
2. Parsear o frontmatter manualmente (com `gray-matter` ou similar)
3. Converter Markdown para HTML (com `remark`/`rehype`)
4. Criar tipos manualmente para cada documento
5. Gerenciar cache e hot-reload

O ContentLayer faz tudo isso automaticamente e gera tipos TypeScript a partir da definição do schema.

## Como o withContentLayer funciona

O `withContentLayer(nextConfig)` intercepta o processo de build do Next.js para:
- Gerar a pasta `.contentlayer/generated` com os dados processados
- Adicionar aliases do webpack para que imports de `contentlayer/generated` funcionem
- Habilitar hot-reload dos arquivos Markdown em desenvolvimento

## O papel do computedFields

Campos computados não existem no frontmatter do Markdown — são derivados de metadados do arquivo. O caso clássico é o **slug**:

- O arquivo `posts/meu-primeiro-post.md` tem `_raw.sourceFileName` = `"meu-primeiro-post.md"`
- O `resolve` remove a extensão: `"meu-primeiro-post"`
- Isso vira a rota `/blog/meu-primeiro-post`

Vantagem: o slug está sempre sincronizado com o nome do arquivo. Não há risco de mismatch entre frontmatter e filesystem.

## Por que image é string e não um tipo especial

A imagem do post é referenciada como path (string) porque pode ser:
- Um path local relativo (`/images/post-cover.jpg`)
- Uma URL externa (ex: avatar do GitHub)

URLs externas precisam de configuração adicional no `next.config.mjs` (domínios permitidos para `next/image`), que é tratado em aulas posteriores.

## Sobre o .gitignore

A pasta `.contentlayer/` é gerada automaticamente durante o build. Commitá-la causaria:
- Conflitos desnecessários em merges
- Dados desatualizados se alguém esquecer de rebuildar
- Peso extra no repositório

É análogo ao `.next/` ou `node_modules/` — sempre gerado, nunca commitado.

## Dica do instrutor sobre TypeScript

Quando o TypeScript não reconhece os tipos gerados pelo ContentLayer (erros em imports de `contentlayer/generated`), duas soluções:
1. **Reload Window** no VS Code (Cmd/Ctrl+Shift+P → "Reload Window")
2. **Restart TS Server** (Cmd/Ctrl+Shift+P → "TypeScript: Restart TS Server")

Isso acontece porque o TS server cacheia os paths e precisa ser notificado das novas configurações do `tsconfig.json`.