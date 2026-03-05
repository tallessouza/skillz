# Deep Explanation: Deploy de Frontend Next.js

## Por que a Vercel e o padrao natural

O Diego explica que a Vercel nao e apenas "mais um hosting" — quando o Next.js e hospedado na Vercel, ele nao roda como uma simples aplicacao Node. A Vercel utiliza internamente varios servicos: Lambdas para execucao serverless das Server Components e API Routes, CloudFront (ou equivalente) para servir arquivos estaticos, e otimizacoes especificas que so existem porque a Vercel e a mesma empresa que mantem o Next.js.

Isso significa que hospedar em outro lugar sempre envolve algum trade-off — seja em performance, em funcionalidades, ou em complexidade de configuracao.

## O argumento economico da Vercel

Diego faz um calculo pratico: mesmo que um projeto Next.js na Vercel custe $400-500/mes (R$2.000-2.500), para uma empresa que fatura, esse custo se paga facilmente pelo esforco de infraestrutura que voce evita. O tempo que um engenheiro gastaria configurando e mantendo a infra em outro lugar vale mais do que o custo do hosting.

Este e um ponto importante: a decisao de hosting nao e puramente tecnica. E uma decisao de negocio que envolve custo de oportunidade do time.

## Cloudflare Pages como alternativa real

O Cloudflare Pages e destacado como a melhor alternativa a Vercel porque:
1. Tem free tier muito generoso
2. Suporta Next.js full stack (App Router, Server Components, etc.)
3. A unica feature nao suportada e Partial Pre-Rendering, que ainda esta em experimental no proprio Next.js

Diego enfatiza que voce deve verificar a pagina de "Supported Features" do Cloudflare Pages para confirmar que as features que seu projeto usa sao suportadas.

## OpenNext: a opcao para controle total

O OpenNext e uma iniciativa da comunidade (nao oficial do Next.js) que replica o comportamento da Vercel na AWS. Ele decompoem a aplicacao Next.js nos mesmos componentes que a Vercel usa internamente:
- **Lambda functions** para execucao serverless
- **CloudFront** para CDN e arquivos estaticos
- **S3** para storage

O SST (recomendado pelo OpenNext) e uma ferramenta de Infrastructure as Code construida em cima do Pulumi, mas focada em projetos TypeScript. A configuracao e extremamente simples — basicamente uma linha de codigo no arquivo de config do SST.

Diego mostra que o SST teve uma migracao de versao (v2 para v3/ion), entao e importante usar a versao mais recente da documentacao.

## Next.js como "apenas Node"

Um insight importante do Diego: **todo projeto Next.js e, no fundo, um projeto Node.js**. Isso significa que se voce nao precisa de performance em nivel de milissegundos (edge functions, serverless distribuido), pode simplesmente hospedar o Next como qualquer aplicacao Node — no Render, Railway, ou qualquer PaaS.

Voce perde as otimizacoes serverless e de edge, mas ganha simplicidade e flexibilidade de escolha de provider.

## Static Export: quando servidor e desnecessario

Se a aplicacao nao utiliza Server-Side Rendering (SSR), como blogs ou sites institucionais, o Next.js permite exportar tudo para arquivos estaticos (HTML, JS, CSS). Isso abre uma enorme variedade de opcoes de hosting gratuito: GitHub Pages, Cloudflare Pages, S3, Netlify, etc.

A chave e identificar se o projeto realmente precisa de funcionalidades server-side. Se nao precisa, static export elimina completamente o custo de servidor.

## Contexto do projeto do curso

No projeto do curso (SaaS com RBAC), Diego escolhe a Vercel porque:
- E um projeto full stack Next.js com App Router
- Usa funcionalidades de SSR e server components
- A facilidade de deploy justifica o custo
- O site da Skillz tambem roda na Vercel, validando a escolha em producao