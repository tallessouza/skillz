# Code Examples: Guidelines de Acessibilidade (WCAG)

## Criterio: Conteudo nao-textual (Nivel A)

Deve ser fornecido alternativas em texto para qualquer conteudo nao-textual (imagens, graficos, audios).

### Imagem com significado

```tsx
// A descricao deve transmitir o que a imagem comunica
<img 
  src="/grafico-vendas-q3.png" 
  alt="Grafico de barras mostrando vendas trimestrais: Q1 R$100k, Q2 R$120k, Q3 R$168k, representando crescimento de 40%" 
/>

// Foto de perfil
<img src={user.avatar} alt={`Foto de perfil de ${user.name}`} />

// Logo com link
<a href="/">
  <img src="/logo.svg" alt="Voltar para pagina inicial - Logo Empresa" />
</a>
```

### Imagem decorativa (excecao ao criterio)

```tsx
// Ilustracao abstrata sem significado → alt vazio
<img src="/triangle-decoration.svg" alt="" />
<img src="/circle-bg.svg" alt="" />
<img src="/wave-pattern.svg" alt="" aria-hidden="true" />

// Imagem de fundo via CSS (ja ignorada por leitores de tela)
<div style={{ backgroundImage: 'url(/pattern.svg)' }} />
```

## Criterio: Contraste de texto (Nivel AA e AAA)

### Nivel AA — Ratio minimo 4.5:1

```tsx
// BOM: texto escuro em fundo claro com contraste suficiente
<p style={{ color: '#333333', backgroundColor: '#ffffff' }}>
  Texto com contraste 12.63:1 (passa AA e AAA)
</p>

// RUIM: texto cinza claro em fundo branco
<p style={{ color: '#aaaaaa', backgroundColor: '#ffffff' }}>
  Texto com contraste 2.32:1 (falha AA)
</p>
```

### Nivel AAA — Contraste melhorado (7:1)

```tsx
// Regras de contraste ainda mais estritas
<p style={{ color: '#1a1a1a', backgroundColor: '#ffffff' }}>
  Texto com contraste 17.4:1 (passa AAA)
</p>
```

### Verificacao pratica com ferramenta

```tsx
// Usar bibliotecas como 'color-contrast-checker' ou extensoes do navegador
// Chrome DevTools → Inspect element → mostra ratio de contraste automaticamente
```

## Criterio: Teclado (Nivel A) — Operavel

```tsx
// CORRETO: elementos nativos ja sao acessiveis por teclado
<button onClick={handleSubmit}>Enviar</button>
<a href="/about">Sobre nos</a>
<input type="text" onChange={handleChange} />

// INCORRETO: div nao e focavel nem ativavel por teclado
<div onClick={handleSubmit}>Enviar</div>

// Se precisar usar div (raro), adicione suporte completo:
<div
  role="button"
  tabIndex={0}
  onClick={handleSubmit}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSubmit()
    }
  }}
>
  Enviar
</div>
```

## Criterio: Idioma da pagina (Nivel A) — Compreensivel

```tsx
// Declarar idioma principal da pagina
<html lang="pt-BR">

// Para trechos em outro idioma dentro da pagina
<p>
  O conceito de <span lang="en">responsive design</span> e fundamental.
</p>
```

## Criterio: Abreviacoes — Compreensivel

```tsx
// Usar <abbr> com title para explicar abreviacoes
<p>
  A <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> define 
  criterios de acessibilidade mantidos pela 
  <abbr title="World Wide Web Consortium">W3C</abbr>.
</p>
```

## Criterio: Mensagens de status (Nivel AA) — Robusto

```tsx
// Mensagem de erro — anunciada imediatamente
function FormComponent() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos ... */}
      
      {error && (
        <div role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div role="status">
          Formulario enviado com sucesso!
        </div>
      )}
    </form>
  )
}
```

### Variacoes de mensagens de status

```tsx
// Toast de notificacao
<div role="status" aria-live="polite">
  Item adicionado ao carrinho
</div>

// Erro critico que precisa atencao imediata
<div role="alert" aria-live="assertive">
  Sessao expirada. Faca login novamente.
</div>

// Progresso de carregamento
<div role="status" aria-live="polite">
  Carregando... 75% concluido
</div>
```

## Criterio: Conteudo audiovisual — legendas e transcricao

```tsx
// Video com legendas
<video controls>
  <source src="/tutorial.mp4" type="video/mp4" />
  <track 
    kind="captions" 
    src="/tutorial-captions-pt.vtt" 
    srcLang="pt-BR" 
    label="Portugues" 
    default 
  />
</video>

// Audio com transcricao disponivel
<audio controls>
  <source src="/podcast.mp3" type="audio/mpeg" />
</audio>
<details>
  <summary>Ver transcricao do audio</summary>
  <p>Texto completo da transcricao...</p>
</details>
```

## Criterio AAA: Som de fundo

```tsx
// Permitir desabilitar som de fundo
function VideoPlayer({ src }: { src: string }) {
  const [bgMusicEnabled, setBgMusicEnabled] = useState(false)

  return (
    <div>
      <video src={src} controls />
      <label>
        <input
          type="checkbox"
          checked={bgMusicEnabled}
          onChange={(e) => setBgMusicEnabled(e.target.checked)}
        />
        Ativar musica de fundo
      </label>
    </div>
  )
}

// Se som de fundo nao pode ser desligado:
// Volume da musica deve ser pelo menos 20dB abaixo da voz
// (aproximadamente 4x mais baixo)
```

## Componente React completo aplicando multiplos criterios

```tsx
function AccessibleContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    
    try {
      await submitForm(new FormData(e.currentTarget))
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="form-title">
      <h2 id="form-title">Formulario de contato</h2>

      {/* Criterio: mensagens de status (Robusto) */}
      {status === 'error' && (
        <div role="alert">Erro ao enviar. Tente novamente.</div>
      )}
      {status === 'success' && (
        <div role="status">Mensagem enviada com sucesso!</div>
      )}

      {/* Criterio: labels associados (Perceptivel) */}
      <label htmlFor="name">Nome completo</label>
      <input 
        id="name" 
        name="name" 
        type="text" 
        required
        aria-describedby={errors.name ? 'name-error' : undefined}
        aria-invalid={!!errors.name}
      />
      {errors.name && <span id="name-error" role="alert">{errors.name}</span>}

      <label htmlFor="email">E-mail</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="message">Mensagem</label>
      <textarea id="message" name="message" required />

      {/* Criterio: operavel por teclado (button nativo) */}
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar mensagem'}
      </button>
    </form>
  )
}
```