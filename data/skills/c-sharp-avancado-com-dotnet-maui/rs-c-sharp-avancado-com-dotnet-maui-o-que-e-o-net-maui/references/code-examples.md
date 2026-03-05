# Code Examples: O que e .NET MAUI

## Estrutura de projeto — comparacao visual

### Xamarin.Forms (multiplos projetos na solution)
```
Solution 'Teste.Epi'
├── Teste.Epi                    # Projeto compartilhado (regras de negocio, telas)
├── Teste.Epi.Android            # Projeto Android (codigo especifico)
├── Teste.Epi.iOS                # Projeto iOS (codigo especifico)
└── Teste.Epi.UWP                # Projeto Windows (codigo especifico)
```

### .NET MAUI (projeto unico com pastas)
```
Solution 'Teste.Epi'
└── Teste.Epi                    # Projeto unico
    ├── Platforms/
    │   ├── Android/             # Codigo especifico Android
    │   ├── iOS/                 # Codigo especifico iOS
    │   ├── MacCatalyst/         # Codigo especifico Mac
    │   └── Windows/             # Codigo especifico Windows
    ├── Resources/               # Recursos compartilhados
    ├── Views/                   # Telas compartilhadas
    └── ViewModels/              # Logica compartilhada
```

## Entry — exemplo de customizacao por plataforma

O componente Entry (campo de texto) herda cores da plataforma. Para customizar cursor e linha, usa-se Handlers com codigo especifico por plataforma, organizado nas pastas dentro de `Platforms/`.

### Comportamento default (sem customizacao)
```
Android (varia por versao):
  - Cursor rosa, azul, verde, cinza ou preto
  - Linha inferior com cor do tema do sistema

iOS:
  - Cursor com cor default do iOS
  - Sem linha inferior por padrao
```

### Com Handler customizado (.NET MAUI)
Codigo fica em `Platforms/Android/` e `Platforms/iOS/` — implementacao detalhada na trilha do curso.

## Ambientes de desenvolvimento

### Windows — setup basico
```bash
# Instalar Visual Studio com workload .NET MAUI
# Visual Studio traz tudo necessario (SDK, emuladores Android, etc.)
```

### Mac — setup
```bash
# Instalar IDE (Visual Studio for Mac ou JetBrains Rider)
# Instalar .NET SDK
# Instalar Xcode (para simulador iOS)
# Configuracoes adicionais do Xcode command line tools
```

### Linux — setup (trabalhoso, apenas Android)
```bash
# Instalar .NET SDK manualmente
# Configurar Android SDK e emulador
# Apenas alvos Android disponiveis
# Configuracao de ambiente mais complexa
```

## Decisao de tecnologia — template

```markdown
## Avaliacao: .NET MAUI para [Nome do Projeto]

### Requisitos do projeto
- [ ] Multiplataforma (Android + iOS)?
- [ ] Equipe domina C#/.NET?
- [ ] UI padrao (formularios, listas, navegacao)?
- [ ] Sem necessidade de animacoes complexas?
- [ ] Sem necessidade de acesso avancado a camera/sensores?
- [ ] Sem necessidade de graficos 3D/jogos?

### Resultado
- 6/6 marcados: MAUI e excelente escolha
- 4-5/6 marcados: MAUI e viavel, avaliar itens nao marcados
- <4/6 marcados: Considerar alternativas (nativo, Flutter, React Native)
```