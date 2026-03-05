# Code Examples: Input File

## 1. Upload básico de foto de perfil

```html
<form action="/api/perfil/foto" method="post" enctype="multipart/form-data">
  <label for="fotoPerfil">Foto de perfil:</label>
  <input type="file" id="fotoPerfil" name="fotoPerfil" accept="image/*" />
  <button type="submit">Enviar</button>
</form>
```

## 2. Upload múltiplo de documentos

```html
<form action="/api/documentos" method="post" enctype="multipart/form-data">
  <label for="docs">Anexar documentos:</label>
  <input type="file" id="docs" name="documentos" multiple accept=".pdf,.doc,.docx" />
  <button type="submit">Enviar</button>
</form>
```

## 3. Upload de vídeo com tipo MIME

```html
<form action="/api/video" method="post" enctype="multipart/form-data">
  <input type="file" name="video" accept="video/*" />
  <button type="submit">Enviar</button>
</form>
```

## 4. Upload restrito por extensão

```html
<!-- Apenas arquivos .mkv -->
<input type="file" name="videoMkv" accept=".mkv" />

<!-- Apenas arquivos .mp4 e .mov -->
<input type="file" name="videoClip" accept=".mp4,.mov" />

<!-- Apenas .html -->
<input type="file" name="pagina" accept=".html" />
```

## 5. Upload de áudio específico

```html
<!-- Qualquer áudio -->
<input type="file" name="musica" accept="audio/*" />

<!-- Apenas MP3 -->
<input type="file" name="podcast" accept="audio/mp3" />
```

## 6. Combinação de filtros

```html
<!-- Imagens e PDFs -->
<input type="file" name="anexo" accept="image/*,.pdf" multiple />
```

## 7. Formulário completo com múltiplos campos

```html
<form action="/api/cadastro" method="post" enctype="multipart/form-data">
  <label for="nome">Nome:</label>
  <input type="text" id="nome" name="nome" />

  <label for="foto">Foto:</label>
  <input type="file" id="foto" name="fotoPerfil" accept="image/*" />

  <label for="curriculo">Currículo:</label>
  <input type="file" id="curriculo" name="curriculo" accept=".pdf" />

  <button type="submit">Cadastrar</button>
</form>
```

## Variações do atributo accept

| Valor | O que aceita |
|-------|-------------|
| `image/*` | Qualquer imagem (jpg, png, gif, webp, etc.) |
| `video/*` | Qualquer vídeo (mp4, mkv, mov, etc.) |
| `audio/*` | Qualquer áudio (mp3, wav, ogg, etc.) |
| `image/png` | Apenas PNG |
| `audio/mp3` | Apenas MP3 |
| `.pdf` | Apenas arquivos com extensão .pdf |
| `.mkv` | Apenas arquivos com extensão .mkv |
| `image/*,.pdf` | Qualquer imagem OU PDFs |
| `.jpg,.png,.gif` | Apenas essas três extensões |