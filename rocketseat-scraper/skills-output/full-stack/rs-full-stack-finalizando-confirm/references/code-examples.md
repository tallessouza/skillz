# Code Examples: Finalizando Confirm

## Exemplo completo da aula

### Importações e componente

```tsx
import okSvg from '../assets/ok.svg'
import { Link } from 'react-router-dom'

function Confirm() {
  return (
    <div className="bg-gray-500 lg:w-[512px] lg:rounded-xl flex flex-col items-center p-10 gap-6">
      <h1 className="text-2xl font-bold text-center text-green-100">
        Solicitação enviada!
      </h1>

      <img src={okSvg} alt="Ícone de ok" className="w-28" />

      <p className="text-sm text-gray-200 text-center">
        Agora é apenas aguardar. Sua solicitação será analisada
        e em breve o setor irá entrar em contato com você.
      </p>

      <Link
        to="/"
        className="w-full text-center p-3 bg-green-100 rounded-lg text-white hover:bg-green-200 transition ease-linear"
      >
        Nova solicitação
      </Link>
    </div>
  )
}
```

## Variações do padrão

### Confirmação de erro (mesmo layout, cores diferentes)

```tsx
function ErrorConfirm() {
  return (
    <div className="bg-gray-500 lg:w-[512px] lg:rounded-xl flex flex-col items-center p-10 gap-6">
      <h1 className="text-2xl font-bold text-center text-red-400">
        Erro ao enviar solicitação
      </h1>

      <img src={errorSvg} alt="Ícone de erro" className="w-28" />

      <p className="text-sm text-gray-200 text-center">
        Ocorreu um erro ao processar sua solicitação.
        Tente novamente em alguns instantes.
      </p>

      <Link
        to="/"
        className="w-full text-center p-3 bg-red-500 rounded-lg text-white hover:bg-red-600 transition ease-linear"
      >
        Tentar novamente
      </Link>
    </div>
  )
}
```

### Confirmação com múltiplas ações

```tsx
function ConfirmWithOptions() {
  return (
    <div className="bg-gray-500 lg:w-[512px] lg:rounded-xl flex flex-col items-center p-10 gap-6">
      <h1 className="text-2xl font-bold text-center text-green-100">
        Solicitação enviada!
      </h1>

      <img src={okSvg} alt="Ícone de ok" className="w-28" />

      <p className="text-sm text-gray-200 text-center">
        Sua solicitação foi registrada com sucesso.
      </p>

      <div className="w-full flex flex-col gap-3">
        <Link
          to="/"
          className="w-full text-center p-3 bg-green-100 rounded-lg text-white hover:bg-green-200 transition ease-linear"
        >
          Nova solicitação
        </Link>

        <Link
          to="/history"
          className="w-full text-center p-3 bg-gray-400 rounded-lg text-gray-100 hover:bg-gray-300 transition ease-linear"
        >
          Ver histórico
        </Link>
      </div>
    </div>
  )
}
```

## Classes Tailwind usadas na aula

### Container do card
```
bg-gray-500        → fundo cinza escuro
lg:w-[512px]       → largura fixa de 512px em telas grandes
lg:rounded-xl      → bordas arredondadas em telas grandes
flex               → display flex
flex-col           → direção coluna
items-center       → centraliza horizontalmente
p-10               → padding de 2.5rem em todos os lados
gap-6              → espaçamento de 1.5rem entre filhos
```

### Título (h1)
```
text-2xl           → font-size 1.5rem
font-bold          → font-weight 700
text-center        → centraliza texto
text-green-100     → cor verde customizada do tema
```

### Imagem
```
w-28               → largura de 7rem (112px)
```

### Parágrafo
```
text-sm            → font-size 0.875rem
text-gray-200      → cor cinza clara customizada
text-center        → centraliza texto
```

### Link/CTA
```
w-full             → largura 100%
text-center        → centraliza texto
p-3                → padding 0.75rem
bg-green-100       → fundo verde customizado
rounded-lg         → bordas arredondadas
text-white         → texto branco
hover:bg-green-200 → hover muda para verde mais claro
transition         → habilita transição CSS
ease-linear        → curva de animação linear
```

## Fluxo completo demonstrado pelo instrutor

```
1. Formulário preenchido:
   - Tipo: "Teste solicitação de teste"
   - Categoria: "Outros"
   - Valor: "134.20"
   - Arquivo: imagem (foto)

2. Submit → console.log(dados) → redirect para /confirm

3. Tela de confirmação:
   ┌─────────────────────────────┐
   │                             │
   │   Solicitação enviada!      │
   │                             │
   │        ✓ (ícone SVG)        │
   │                             │
   │  Agora é apenas aguardar.   │
   │  Sua solicitação será       │
   │  analisada e em breve o     │
   │  setor irá entrar em        │
   │  contato com você.          │
   │                             │
   │  [ Nova solicitação ]       │
   │                             │
   └─────────────────────────────┘

4. Click "Nova solicitação" → redirect para /
```