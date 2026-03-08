# Deep Explanation: Criar o AppLayout

## Por que layouts compartilhados existem

Quando voce tem uma aplicacao com multiplas paginas, elementos como header, sidebar e footer se repetem. Sem um layout compartilhado, voce copia e cola esses elementos em cada pagina — qualquer mudanca no header exige alterar N arquivos.

O React Router resolve isso com o conceito de **layout routes**: uma rota pai que renderiza um componente de layout, e esse layout usa `<Outlet />` para injetar o conteudo da rota filha ativa.

## Como o Outlet funciona

O `Outlet` e um componente do React Router que age como um "slot" — ele renderiza o componente da rota filha que esta ativa no momento. Funciona como o `children` do React, mas controlado pelo router.

```
URL: /dashboard
├── AppLayout (renderiza header + Outlet)
│   └── Outlet → Dashboard (rota filha ativa)

URL: /profile
├── AppLayout (renderiza header + Outlet)
│   └── Outlet → Profile (rota filha ativa)
```

O layout permanece montado enquanto o usuario navega entre rotas filhas. Apenas o conteudo dentro do Outlet muda.

## Compartilhando entre perfis

O instrutor destaca que o mesmo AppLayout serve tanto para employee quanto para manager, porque ambos compartilham o mesmo header (logo, nome do usuario, botao de sair). Isso e um principio importante: **nao crie layouts separados se a estrutura visual e identica**.

Se no futuro os layouts divergirem (manager ganha sidebar, employee nao), ai sim voce cria layouts separados. Mas comece com um so.

## Classes Tailwind do layout

### Na div raiz:
- `w-full` — ocupa toda a largura disponivel
- `h-screen` — ocupa toda a altura da viewport (100vh)
- `bg-gray-400` — cor de fundo cinza
- `flex flex-col` — flexbox em coluna (header em cima, conteudo embaixo)
- `items-center` — centraliza horizontalmente
- `text-gray-100` — cor de texto clara (contraste com fundo escuro)

### No main:
- `m-3` — margem de 12px em todas as direcoes (3 × 4px)
- `w-full` — largura total por padrao (mobile)
- `md:w-auto` — a partir de 768px, largura automatica (se ajusta ao conteudo)

O prefixo `md:` e um breakpoint do Tailwind que aplica a classe apenas quando a tela tem 768px ou mais. Isso garante que no mobile o conteudo ocupa a tela toda, e no desktop ele se ajusta.

## Organizacao de arquivos

O arquivo `app.layout.tsx` fica na pasta `components/` porque e um componente reutilizavel, nao uma pagina. Convencao de nome com ponto (app.layout) ajuda a identificar que e um layout e nao um componente de UI generico.

## Estrutura de rotas resultante

```tsx
// employee.routes.tsx
<Route path="/" element={<AppLayout />}>
  <Route index element={<Dashboard />} />
  {/* outras rotas do employee */}
</Route>

// manager.routes.tsx (futuro)
<Route path="/manager" element={<AppLayout />}>
  <Route index element={<ManagerDashboard />} />
  {/* outras rotas do manager */}
</Route>
```

Ambos os grupos de rotas usam o mesmo AppLayout. O header e compartilhado sem duplicacao.