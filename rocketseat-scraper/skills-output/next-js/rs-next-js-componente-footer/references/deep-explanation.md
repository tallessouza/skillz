# Deep Explanation: Componente Footer

## Por que componentizar o footer separado?

O instrutor segue o padrao de criar cada secao do layout como componente isolado (`header.tsx`, `footer.tsx`), cada um com seu barrel export (`index.ts`). Isso permite que o `layout.tsx` fique limpo, apenas orquestrando a estrutura da pagina.

## O pattern de responsividade

A abordagem do instrutor para responsividade e consistente:
- **Mobile-first**: comeca com `flex-col` (empilhado)
- **Desktop override**: usa `md:flex-row` para alinhar horizontalmente
- **Justify muda com breakpoint**: `justify-center` no mobile (centralizado), `md:justify-between` no desktop (espacado)
- **Padding escalonado**: `px-4` base → `sm:px-6` → `lg:px-8`

Esse padrao se repete em TODOS os componentes do projeto. E o "idioma" de layout usado.

## Container pattern

O container usado e `max-w-7xl mx-auto` com padding horizontal responsivo. Nao usa o componente `Container` do Tailwind — prefere o pattern manual para mais controle.

## A reflexao sobre componentizacao

No final da aula, o instrutor faz um ponto pedagogico importante: ele mostra que PODERIA copiar o bloco de logo do footer para o header, e funcionaria. Mas destaca que "uma das caracteristicas mais importantes do React e justamente a componentizacao". Isso motiva a proxima aula onde criam um componente `Logo` reutilizavel.

A mensagem e: **sempre que voce perceber duplicacao entre componentes, e hora de extrair um componente compartilhado.** Nao depois. Agora.

## Estrutura de arquivos

```
components/
├── footer/
│   ├── footer.tsx    # Componente principal
│   └── index.ts      # Barrel export
├── header/
│   ├── header.tsx
│   └── index.ts
└── logo/             # (proxima aula)
    ├── logo.tsx
    └── index.ts
```

## Acesso a pasta public

O instrutor reforça: o `/` no `src` das imagens acessa automaticamente a pasta `public/`. Se houvesse uma subpasta `assets/`, seria `/assets/logo.svg`. Nunca inclua `public/` no path.

## Links semanticos no footer

O footer usa tres links tipicos de qualquer aplicacao web:
- **Termos de uso** — obrigatorio legalmente em muitos contextos
- **Politica de privacidade** — obrigatorio com LGPD/GDPR
- **Enviar feedback** — canal de comunicacao com usuario

Esses links sao envolvidos em `<nav>` por semantica HTML, e usam `hover:text-primary` para feedback visual.