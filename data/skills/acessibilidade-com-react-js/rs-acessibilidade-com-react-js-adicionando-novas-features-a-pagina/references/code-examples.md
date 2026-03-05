# Code Examples: Modal Acessivel em React

## Estrutura HTML do modal

```tsx
// index.tsx (pages)
// Modal criado logo abaixo do footer
<div className={styles.modal}>
  <h2>Termos de Uso</h2>
  <p>Esses são os termos de uso</p>
</div>
```

## CSS de centralizacao

```css
/* home.module.css */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 120px;
  border: ridge 5px;
  color: #333;
}
```

### Explicacao passo a passo da centralizacao:
1. `position: fixed` — modal fica fixo na viewport, nao scroll com a pagina
2. `top: 50%` — canto superior do modal vai para 50% da altura da tela
3. `left: 50%` — canto esquerdo do modal vai para 50% da largura da tela
4. `transform: translate(-50%, -50%)` — desloca o modal de volta em 50% do seu proprio tamanho (horizontale vertical), centralizando perfeitamente

## Estado React para controle do modal

```tsx
// Declaracao do estado
const [isModalOpen, setIsModalOpen] = useState(false)

// Funcao que abre o modal
function handleModalOpen() {
  setIsModalOpen(true)
}
```

## Renderizacao condicional (short-circuit)

```tsx
{isModalOpen && (
  <div className={styles.modal}>
    <h2>Termos de Uso</h2>
    <p>Esses são os termos de uso</p>
  </div>
)}
```

Quando `isModalOpen` e `false`, React nao renderiza nada. Quando `true`, renderiza o modal.

## Botao trigger (antes e depois)

### Antes (link semanticamente incorreto):
```tsx
<a href="https://github.com/...">Termos de uso</a>
```

### Depois (botao correto):
```tsx
<button type="button" onClick={handleModalOpen}>
  Termos de uso
</button>
```

### Estilizacao do botao para parecer link:

```css
button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1rem; /* 16px — acessivel porque escala com body */
}
```

O instrutor destaca que usar `1rem` em vez de `16px` e mais acessivel: se o tamanho da fonte do body mudar (por tecnologia assistiva), essa fonte acompanha.

## Teste com ChromeVox — resultado

Ao clicar no botao com ChromeVox ativo:
- ChromeVox leu: "Termos de uso" (nome do botao)
- ChromeVox informou: "botao" (role do elemento)
- Modal abriu visualmente na tela
- ChromeVox **NAO anunciou** que o modal abriu
- ChromeVox so leu o conteudo do modal ao clicar diretamente nele

**Conclusao**: modal sem atributos ARIA e invisivel para tecnologias assistivas no momento da abertura.