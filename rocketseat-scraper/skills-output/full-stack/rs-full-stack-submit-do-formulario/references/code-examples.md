# Code Examples: Submit do Formulário em React

## Exemplo 1: Formulário sem prevenção (problema)

O instrutor demonstra o problema: ao clicar em Salvar, a página recarrega e todos os campos são limpos.

```tsx
function EventForm() {
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventType, setEventType] = useState("")
  const [description, setDescription] = useState("")

  return (
    <form>
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="">Selecione</option>
        <option value="react">React</option>
      </select>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {/* Ao clicar, o form faz submit HTTP e recarrega a página */}
      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Exemplo 2: preventDefault no onClick do botão (funciona, mas não ideal)

Primeira abordagem mostrada pelo instrutor — previne via clique no botão.

```tsx
function EventForm() {
  // ... estados ...

  function onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    // dados preservados, sem reload
  }

  return (
    <form>
      {/* ... inputs ... */}
      <button type="submit" onClick={onSubmit}>Salvar</button>
    </form>
  )
}
```

**Nota do instrutor:** Ele teve dificuldade com a tipagem aqui — inicialmente tentou usar `React.FormEvent<HTMLFormElement>` no onClick do botão, mas o tipo correto para onClick é `React.MouseEvent<HTMLButtonElement>`.

## Exemplo 3: preventDefault no onSubmit do form (abordagem correta)

O instrutor refatora para usar `onSubmit` diretamente no formulário.

```tsx
function EventForm() {
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventType, setEventType] = useState("")
  const [description, setDescription] = useState("")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // processar dados do formulário
    console.log({ eventName, eventDate, eventType, description })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="">Selecione</option>
        <option value="react">React</option>
      </select>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {/* Botão não precisa de onClick — o form captura o submit */}
      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Exemplo 4: Variação com múltiplos botões

Extensão prática do conceito ensinado — quando o form tem mais de um botão.

```tsx
function EventForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // salvar dados
  }

  function handleCancel() {
    // limpar formulário ou navegar
  }

  return (
    <form onSubmit={onSubmit}>
      {/* ... inputs ... */}
      <button type="button" onClick={handleCancel}>Cancelar</button>
      <button type="submit">Salvar</button>
    </form>
  )
}
```

**Ponto-chave:** O botão "Cancelar" usa `type="button"` explícito para NÃO acionar o submit do formulário. Sem esse type, o default é `submit` e ambos os botões submeteriam o form.