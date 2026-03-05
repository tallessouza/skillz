# Code Examples: Setup do VSCode para Angular

## Demonstracao do Angular Language Service

### Exemplo do instrutor: validacao de propriedade no template

O instrutor abre o componente `TaskListSection` e demonstra:

**Template com erro (propriedade nao existe na classe):**
```html
<!-- task-list-section.component.html -->
<div>
  {{ teste }}  <!-- ERRO: Property 'teste' does not exist on type 'TaskListSectionComponent' -->
</div>
```

**Classe sem a propriedade:**
```typescript
// task-list-section.component.ts
@Component({
  selector: 'app-task-list-section',
  templateUrl: './task-list-section.component.html'
})
export class TaskListSectionComponent {
  // 'teste' nao existe aqui — Language Service sinaliza erro no template
}
```

**Correcao: declarar a propriedade na classe:**
```typescript
// task-list-section.component.ts
@Component({
  selector: 'app-task-list-section',
  templateUrl: './task-list-section.component.html'
})
export class TaskListSectionComponent {
  teste = '';  // Agora o Language Service reconhece e o erro desaparece
}
```

## Extensoes recomendadas — lista completa

### Instalacao via terminal (alternativa ao marketplace):
```bash
# Obrigatorio
code --install-extension Angular.ng-template

# Icones
code --install-extension PKief.material-icon-theme

# Tema (escolha um)
code --install-extension ahmadawais.shades-of-purple
code --install-extension skillz.theme-omni

# Angular Generator (opcional, para uso futuro)
code --install-extension alexiv.vscode-angular2-files
```

### Settings recomendadas para Angular no VSCode:
```json
{
  "workbench.colorTheme": "Shades of Purple (Super Dark)",
  "workbench.iconTheme": "material-icon-theme",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**Nota:** Prettier e formatOnSave serao configurados mais adiante no curso, quando o projeto for criado. Listados aqui como referencia completa.