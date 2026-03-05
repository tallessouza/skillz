# Code Examples: Ajustes Finais em Projetos CSS

## Exemplo 1: Correção de tipografia no footer

O instrutor identificou que o footer não seguia o padrão tipográfico do design (14px, 150%, Poppins).

```css
/* ANTES: footer sem estilo tipográfico definido */
footer {
  /* apenas estilos de layout, sem tipografia */
}

/* DEPOIS: tipografia alinhada com o design */
footer {
  font-family: var(--font-family);  /* Poppins via variável CSS */
  font-size: 14px;
  line-height: 150%;
}
```

### Variação: quando não há variável CSS

```css
/* Se o projeto não usa custom properties */
footer {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  line-height: 150%;
}
```

### Variação: múltiplas seções com mesmo padrão

```css
/* Se footer, aside e small text usam o mesmo padrão */
footer,
.sidebar-text,
.caption {
  font-family: var(--font-family);
  font-size: 14px;
  line-height: 150%;
}
```

## Exemplo 2: Imagem de perfil com dimensões fixas

O instrutor corrigiu a imagem do header que distorcia em telas menores.

```css
/* ANTES: imagem sem restrições */
.profile-image {
  /* sem width/height, cresce com o container */
}

/* DEPOIS: dimensões fixas com proteção */
.profile-image {
  width: 176px;
  height: 176px;
  object-fit: cover;
  border-radius: 50%;
}
```

### Variação: imagem de perfil responsiva (próximo nível)

```css
/* Para quando aprender responsividade */
.profile-image {
  width: 176px;
  height: 176px;
  object-fit: cover;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .profile-image {
    width: 120px;
    height: 120px;
  }
}
```

### Variação: diferentes formatos de imagem

```css
/* Imagem quadrada - object-fit não faz diferença visual */
.profile-image-square {
  width: 176px;
  height: 176px;
  object-fit: cover;
  border-radius: 50%;
}

/* Imagem retangular - object-fit: cover corta o excesso */
.profile-image-rect {
  width: 176px;
  height: 176px;
  object-fit: cover;      /* Corta laterais ou topo/base */
  border-radius: 50%;     /* Resultado continua circular */
}
```

## Exemplo 3: Fluxo de commit e publicação

```bash
# Adicionar todas as mudanças
git add .

# Comitar com mensagem descritiva
git commit -m "final project"

# Publicar branch (primeira vez)
git push -u origin main

# Publicações subsequentes
git push
```

### Variação: commit mais descritivo (recomendado)

```bash
git add .
git commit -m "fix: adjust footer typography and profile image sizing"
git push
```