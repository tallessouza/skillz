# Code Examples: Update do Projeto

## Exemplo 1: Estrutura do componente Button com CSS Modules

### Componente React (Button.tsx)
```tsx
import styles from './button.module.css'

interface ButtonProps {
  title: string
  onClick?: () => void
}

export function Button({ title, onClick }: ButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      {title}
    </button>
  )
}
```

### CSS Module original (button.module.css)
```css
.button {
  background-color: #6c63ff;
  border: 1px solid #6c63ff;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
```

### CSS Module atualizado
```css
.button {
  background-color: #e8d44d;
  border: 1px solid #e8d44d;
  color: #000000;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
```

## Exemplo 2: Encontrando cores existentes no projeto

### Header com a cor de referência (header.module.css)
```css
.attempts span strong {
  color: #e8d44d;
}
```

### Reutilizando no botão
```css
/* Copie o valor exato — #e8d44d — do header para o botão */
.button {
  background-color: #e8d44d;  /* mesma cor do span strong */
  border: 1px solid #e8d44d;  /* mesma cor para consistência */
  color: #000000;              /* preto para contraste */
}
```

## Exemplo 3: Variações de ajuste de contraste

### Fundo claro → texto escuro
```css
.button-light {
  background-color: #e8d44d;
  color: #000000;
}
```

### Fundo escuro → texto claro
```css
.button-dark {
  background-color: #1a1a2e;
  color: #ffffff;
}
```

### Fundo médio → verificar qual funciona melhor
```css
.button-medium {
  background-color: #4a90d9;
  color: #ffffff; /* branco geralmente funciona em tons médios */
}
```

## Exemplo 4: Fluxo completo de atualização

```bash
# 1. Rodar o projeto localmente
npm run dev
# Saída: Local: http://localhost:5173/

# 2. Fazer a modificação no CSS Module
# (editar button.module.css conforme exemplos acima)

# 3. Verificar no browser — hot reload já mostra a mudança

# 4. Verificar que o build funciona
npm run build

# 5. Commitar
git add src/components/Button/button.module.css
git commit -m "style: update button colors for better visibility"

# 6. Push para trigger de deploy (se CI/CD configurado)
git push origin main
```

## Exemplo 5: Usando DevTools para encontrar cores

```
1. Abra o browser em localhost:5173
2. Botão direito → Inspecionar no elemento com a cor desejada
3. Aba "Computed" → procure por "color" ou "background-color"
4. Copie o valor hex (ex: #e8d44d)
5. Cole no seu CSS Module
```