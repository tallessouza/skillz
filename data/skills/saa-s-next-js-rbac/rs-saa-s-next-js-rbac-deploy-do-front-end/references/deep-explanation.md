# Deep Explanation: Deploy do Front-end Next.js na Vercel

## Por que variáveis de ambiente sem NEXT_PUBLIC_ são seguras

O Diego enfatiza um ponto que causa confusão: colocar variáveis como `DATABASE_URL` na configuração da Vercel para um projeto Next.js **não** expõe essas variáveis no navegador. O Next.js tem uma regra clara — apenas variáveis prefixadas com `NEXT_PUBLIC_` são inlined no bundle do client. As demais ficam disponíveis apenas no server (API routes, Server Components, getServerSideProps).

## O problema do cache do TurboRepo com variáveis de ambiente

O TurboRepo tem um sistema de cache agressivo. Quando você roda `turbo run build`, ele verifica se os inputs mudaram desde o último build. Se nada mudou, ele usa o cache. O problema: por padrão, variáveis de ambiente **não são consideradas inputs**. Então se você muda uma variável de ambiente mas não muda código, o TurboRepo pode servir um build antigo com as variáveis antigas.

A solução "correta" é listar cada variável no `turbo.json` dentro do campo `env` do pipeline de build. Isso diz ao TurboRepo: "se essas variáveis mudarem, invalide o cache".

A solução "prática" para projetos menores é `--env-mode=loose`, que basicamente diz: "qualquer mudança em qualquer variável de ambiente invalida o cache". Menos eficiente, mas zero manutenção.

## Doppler vs Infisical — A visão do Diego

O Diego menciona que na Skillz usaram Doppler por muito tempo. Ambos fazem a mesma coisa básica: centralizar variáveis de ambiente e sincronizar com serviços (Vercel, Render, etc).

A vantagem do Infisical que o Diego destaca é o suporte para ambiente de desenvolvimento local. Com Infisical, um novo dev no time roda um comando e baixa automaticamente todas as variáveis de desenvolvimento compartilhadas. Isso elimina o clássico "me manda teu .env" no onboarding.

Para projetos pequenos ou individuais, o custo de configurar essas ferramentas não compensa — copiar manualmente é suficiente.

## Filtro de monorepo da Vercel

Quando a Vercel detecta um TurboRepo, ela automaticamente aplica um filtro: se o push contém mudanças apenas em `apps/web`, apenas o deploy do frontend é triggado. Se as mudanças são em `apps/api`, apenas o backend re-deploya. O Diego confirma isso ao mostrar que após um commit que mexeu só em arquivos do frontend, o deploy do backend (no Render) não foi re-triggado.

## O problema real do .env compartilhado

O Diego admite que no projeto do curso, front e back compartilham o mesmo `.env` na raiz. Ele recomenda separar no futuro porque: (1) cada serviço precisa apenas das suas variáveis, (2) hospedar em serviços diferentes (Vercel + Render) torna o compartilhamento impossível de qualquer forma, (3) variáveis de banco de dados não fazem sentido no frontend.

A exceção seria se front e back estivessem hospedados juntos na Vercel — aí um único `.env` faria sentido.