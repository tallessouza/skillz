# Deep Explanation: Componente Secondary Button

## Estrategia de reutilizacao de CSS

O instrutor demonstra um padrao pragmatico: ao inves de criar um sistema de design abstrato com variaveis CSS e mixins, ele simplesmente copia o CSS do Primary Button e ajusta os valores que diferem. Para componentes iniciais de um projeto, essa abordagem e mais rapida e suficiente.

### Diferencas entre Primary e Secondary Button

| Atributo | Primary Button | Secondary Button |
|----------|---------------|-----------------|
| Height | 48px | 40px |
| Background | `linear-gradient(...)` | Cor solida `#hex` (blue dark) |
| Padding top/bottom | Diferente | 10px |
| Icone | Nao mencionado | Sim (Phosphor Icons, dinamico) |
| Gap | Nao mencionado | 8px |

## Por que display flex e necessario

Quando um botao contem um `<i>` (icone) e texto, o navegador renderiza inline por padrao. Isso causa desalinhamento vertical — o texto fica ligeiramente abaixo do icone. Aplicar `display: flex` com `align-items: center` resolve isso forçando alinhamento no eixo cruzado.

## Phosphor Icons — integracao

O projeto usa Phosphor Icons via classes CSS (`ph ph-plus`). O tamanho do icone e controlado via `font-size` no seletor `.custom-button i`, nao via width/height, porque icon fonts sao tratados como texto pelo navegador.

## Estado disabled (mencionado mas nao implementado)

O instrutor menciona que o estado disabled segue a mesma logica do Primary Button: aplicar `opacity: 50%`. Porem, ele adia a implementacao para aulas de input, onde os valores serao alterados dinamicamente. Isso sugere uso futuro de `@Input()` para controlar o estado.

## Icone dinamico

O instrutor menciona que o icone sera dinamico no futuro, mas fixa como `ph-plus` por enquanto. Isso indica que o componente recebera um `@Input()` para a classe do icone, permitindo reutilizacao com diferentes icones.

## Organizacao de pastas

O componente e criado dentro de `src/app/_components/`, seguindo o padrao do projeto onde componentes reutilizaveis ficam nessa pasta com prefixo underscore.