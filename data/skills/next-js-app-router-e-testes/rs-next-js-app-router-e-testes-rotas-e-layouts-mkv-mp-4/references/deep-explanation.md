# Deep Explanation: Rotas e Layouts no Next.js App Router

## Roteamento baseado em arquivos — o modelo mental

O Next.js App Router usa o sistema de arquivos como API de roteamento. Isso significa que a estrutura de pastas dentro de `app/` **e** a estrutura de URLs da aplicacao. Nao existe um arquivo de configuracao de rotas — a convencao e a configuracao.

O instrutor enfatiza: "Toda a parte de roteamento do Next e feita com base em arquivos." Isso e o principio fundamental. Nao ha `react-router`, nao ha `routes.ts` — a pasta vira a rota.

## Como o Next resolve uma rota

Quando o usuario acessa `/catalog/product`, o Next:

1. Olha para `app/`
2. Encontra a pasta `catalog/`
3. Dentro dela, encontra a pasta `product/`
4. Dentro de `product/`, encontra `page.tsx` — essa e a pagina renderizada

O nome do componente exportado **nao importa** para o roteamento. O que importa e:
- O arquivo se chamar `page.tsx`
- As pastas que o envolvem

Como o instrutor explica: "O nome da rota e determinado pelas pastas que estao por volta desse arquivo."

## O conceito de layout como wrapper

O instrutor usa a palavra "wrapper" para descrever o layout: "O layout e um wrapper. Toda a minha aplicacao vai estar dentro do meu layout."

Isso significa que o layout nao e uma pagina — e um envelope. O conteudo da pagina (`page.tsx`) e injetado no lugar do `{children}` dentro do layout.

### Encadeamento de layouts

O Next encadeia layouts hierarquicamente. Se voce tem:

```
app/layout.tsx          → Root layout (sempre presente)
app/admin/layout.tsx    → Admin layout (adicional)
app/admin/page.tsx      → Pagina admin
```

Quando o usuario acessa `/admin`, o Next renderiza:

```
Root Layout
  └── Admin Layout
        └── Admin Page
```

O instrutor demonstrou isso criando um `<p>Painel de administração</p>` no layout do admin. Esse paragrafo aparece em `/admin` e `/admin/login`, mas **nao** em `/catalog` ou na home — porque o layout do admin so afeta as rotas dentro da pasta `admin/`.

## Root layout — por que nunca deletar

O `app/layout.tsx` e especial:
- E obrigatorio (o Next exige)
- Contem as tags `<html>` e `<body>`
- Envolve **toda** a aplicacao
- Qualquer coisa colocada nele aparece em **todas** as paginas

O instrutor adicionou um `<header>Cabeçalho</header>` no root layout e mostrou que ele aparece em todas as rotas — home, catalog, product, admin.

## Convencoes de nomes de arquivo no App Router

O Next reconhece nomes especificos de arquivo:
- `page.tsx` — componente da pagina (gera rota)
- `layout.tsx` — wrapper que envolve paginas e sub-layouts
- Outros arquivos (como `utils.ts`, `components.tsx`) **nao** geram rotas

Isso significa que voce pode colocar arquivos auxiliares dentro das pastas de rota sem criar rotas indesejadas.

## Quando usar layouts separados

O instrutor da o exemplo pratico: "Imagina que todas as paginas de autenticacao possuem uma estrutura comum, mas as paginas de administracao possuem outro layout."

Casos de uso tipicos:
- **Auth layout**: paginas de login/registro com design centralizado
- **Admin/Dashboard layout**: sidebar + header de navegacao
- **Marketing layout**: header/footer diferentes do app principal
- **Settings layout**: menu lateral de configuracoes