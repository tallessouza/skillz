# Code Examples: Estruturando o Header

## Estrutura completa do header da aula

```html
<header>
  <div class="bg-surface-color">
    <div class="container">
      <!-- Profile: foto + nome + descricao -->
      <div class="profile">
        <img src="./assets/profile-pic.jpg" alt="Imagem de Isabela Torres" />
        <div>
          <h1>Isabela Torres</h1>
          <p>
            Exploradora urbana e amante de novas culturas, sempre em busca de
            experiencias autenticas ao redor do mundo. Compartilho minhas
            aventuras e dicas de viagem para inspirar outros a descobrirem
            o mundo.
          </p>
        </div>
      </div>

      <!-- Info: metadados em lista -->
      <div class="info">
        <ul>
          <li>
            <img src="./assets/icons/map-pin.svg" alt="Icone de mapa" />
            <span>Sao Paulo, Brasil</span>
          </li>
          <li>
            <img src="./assets/icons/airplane.svg" alt="Icone de aviao" />
            <span>37 paises</span>
          </li>
          <li>
            <img src="./assets/icons/image.svg" alt="Icone de imagem" />
            <span>240 fotos</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</header>
```

## Variacao: header de perfil com redes sociais

```html
<header>
  <div class="bg-surface-color">
    <div class="container">
      <div class="profile">
        <img src="./assets/avatar.jpg" alt="Foto de João Silva" />
        <div>
          <h1>João Silva</h1>
          <p>Desenvolvedor full stack e entusiasta de open source.</p>
        </div>
      </div>

      <div class="info">
        <ul>
          <li>
            <img src="./assets/icons/briefcase.svg" alt="Icone de trabalho" />
            <span>Senior Developer</span>
          </li>
          <li>
            <img src="./assets/icons/map-pin.svg" alt="Icone de localizacao" />
            <span>Rio de Janeiro, Brasil</span>
          </li>
          <li>
            <img src="./assets/icons/github.svg" alt="Icone do GitHub" />
            <span>@joaosilva</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</header>
```

## Variacao: sem wrapper de background (conteudo simples)

```html
<header>
  <div class="container">
    <div class="profile">
      <img src="./assets/photo.jpg" alt="Foto de perfil" />
      <div>
        <h1>Maria Santos</h1>
        <p>Designer grafica.</p>
      </div>
    </div>
  </div>
</header>
```

Nesse caso, sem `.bg-surface-color` porque o header usa o mesmo fundo da pagina.

## Padrao do item de lista (icone + texto)

```html
<!-- Padrao base -->
<li>
  <img src="./assets/icons/nome-do-icone.svg" alt="Descricao do icone" />
  <span>Texto do metadado</span>
</li>
```

O `<img>` vem primeiro, seguido do `<span>`. Ambos ficam lado a lado quando Flexbox e aplicado ao `<li>`.

## Processo mental de construcao

1. Olhar o design e identificar blocos visuais
2. Nomear cada bloco (profile, info, container)
3. Pensar qual CSS sera necessario (flex, direcao)
4. Escolher tags semanticas (header, ul, h1)
5. Escrever HTML usando Emmet para agilizar
6. Aceitar que ajustes virao quando o CSS for aplicado