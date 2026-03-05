# Code Examples: Visao dos Componentes

## Estrutura de arquivos do projeto (inferida da aula)

```
app/
├── app.html                          # Ponto de entrada
├── features/
│   ├── auth/
│   │   ├── authentication-screen/    # Container: layout da tela de auth
│   │   ├── login-form/               # Form de login (email, senha)
│   │   └── register-user-form/       # Form de cadastro
│   ├── movies/
│   │   ├── explore-movies/           # Tela de exploracao (filtro + lista)
│   │   ├── favorite-movies/          # Tela de favoritos
│   │   ├── movie-details/            # Detalhes de um filme
│   │   ├── create-movie/             # Form de criacao de filme
│   │   └── movies-list/              # Componente reutilizavel de lista
│   └── core/
│       └── header/                   # Header compartilhado
```

## Exemplo: Container com componente intercambiavel

```html
<!-- authentication-screen.component.html -->
<!-- Todo o layout visual (background, centralizacao) -->
<div class="min-h-screen bg-cover bg-center flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-lg p-8">
    <!-- Aqui entra LoginForm OU RegisterUserForm -->
    <app-login-form />
    <!-- Ou trocar por: <app-register-user-form /> -->
  </div>
</div>
```

## Exemplo: ExploreMovies usando MoviesList

```html
<!-- explore-movies.component.html -->
<div>
  <h1>Explorar Filmes</h1>

  <!-- Filtro -->
  <input type="text" placeholder="Buscar filmes..." />

  <!-- Botao adicionar -->
  <button>Adicionar Filme</button>

  <!-- Componente reutilizavel -->
  <app-movies-list />
</div>
```

## Exemplo: FavoriteMovies usando o mesmo MoviesList

```html
<!-- favorite-movies.component.html -->
<div>
  <h1>Meus Favoritos</h1>

  <!-- Sem filtro, sem botao adicionar -->
  <!-- Mesmo componente de lista -->
  <app-movies-list />
</div>
```

## Exemplo: app.html como ponto de entrada

```html
<!-- app.html -->
<!-- O componente raiz que decide o que mostrar -->
<!-- Futuramente sera substituido por <router-outlet> -->
<app-authentication-screen />
```

## Componentes e seus seletores

| Componente | Seletor | Responsabilidade |
|-----------|---------|-----------------|
| AuthenticationScreen | `<app-authentication-screen>` | Layout da tela de auth (background + slot) |
| LoginForm | `<app-login-form>` | Campos email, senha + botao entrar |
| RegisterUserForm | `<app-register-user-form>` | Campos de cadastro + botao criar conta |
| Header | `<app-header>` | Menu, logout, responsivo |
| ExploreMovies | `<app-explore-movies>` | Filtro + adicionar + lista |
| FavoriteMovies | `<app-favorite-movies>` | Lista de favoritos |
| MovieDetails | `<app-movie-details>` | Detalhes, avaliacoes, favoritar |
| CreateMovie | `<app-create-movie>` | Form upload imagem + dados + salvar |
| MoviesList | `<app-movies-list>` | Renderiza cards de filmes (reutilizavel) |

## Padrao de composicao demonstrado

```
AuthenticationScreen (container)
  └── LoginForm (funcional)        ← intercambiavel
  └── RegisterUserForm (funcional) ← intercambiavel

ExploreMovies (feature)
  └── MoviesList (compartilhado)   ← reutilizado

FavoriteMovies (feature)
  └── MoviesList (compartilhado)   ← mesmo componente
```