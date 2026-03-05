# Code Examples: Exportando Assets do Figma

## Workflow visual de exportacao

Este skill nao envolve codigo, mas sim um processo visual. Aqui esta o passo-a-passo detalhado:

### Processo completo de exportacao

```
1. Abrir link do Figma no navegador
   URL: (link compartilhado pelo instrutor)
   Modo: Visualizacao apenas

2. Verificar ferramenta ativa:
   [x] Seta de selecao (primeiro icone) — CORRETO
   [ ] Mao (segundo icone) — NAO usar para exportar

3. Clicar no elemento desejado
   → Elemento fica com borda azul de selecao
   → Painel direito mostra propriedades

4. Localizar secao "Export" no painel direito
   → Selecionar formato:
      - SVG  (vetorial, escalavel)
      - PNG  (raster, com transparencia)
      - JPG  (raster, sem transparencia)

5. Clicar botao "Exportar"
   → Arquivo salvo na pasta de downloads
```

### Organizacao de assets no projeto .NET MAUI

Apos exportar, os assets serao organizados no projeto. A estrutura tipica:

```
Resources/
├── Images/
│   ├── cat.svg           # Ilustracoes vetoriais
│   ├── onboarding1.png   # Imagens de onboarding
│   └── logo.svg          # Logo do app
├── Fonts/
└── Styles/
    ├── LightTheme.xaml   # Cores do light mode
    └── DarkTheme.xaml    # Cores do dark mode
```

### Temas no prototipo

O Figma do projeto PlanShare contem:

```
Paginas do Figma:
├── Light Mode/
│   ├── Splash Screen
│   ├── Onboarding
│   ├── Login
│   ├── Home
│   └── ... (demais telas)
└── Dark Mode/
    ├── Splash Screen
    ├── Onboarding
    ├── Login
    ├── Home
    └── ... (demais telas)
```

Ao exportar, verificar de qual versao (light/dark) o asset esta sendo exportado, pois algumas imagens podem ter variacoes de cor entre temas.