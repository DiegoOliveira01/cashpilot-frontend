import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';

/** 
 * Importação dos SVGs do Lucide. 
 * Sempre que adicionar um ícone em `AVAILABLE_ICONS` (arquivo icons.ts), 
 * adicione-o também nesta lista abaixo.
*/

import { // Import de icones
  lucideShoppingCart, lucideCar, lucideHome, lucideUtensils,
  lucideGamepad2, lucideAntenna,  lucideBriefcase, lucideLaptop, lucidePiggyBank, lucideGift,
  lucideCarTaxiFront, lucideZap, lucideFactory, lucideLandmark, lucideHeartPulse, lucideGraduationCap, lucidePlane,
  lucideRepeat, lucideDumbbell, lucideSmartphone, lucideCoffee, lucideArrowDownLeft, lucideArrowUpRight,
  lucideTag
} from '@ng-icons/lucide';

/**
 * =========================================================================================
 * COMPONENTE GLOBAL DE ÍCONES (Wrapper)
 * =========================================================================================
 * Este componente encapsula o `NgIcon` para padronizar a renderização de ícones em todo o app.
 * Ele registra todos os ícones do projeto em um único lugar (via `provideIcons`).
 * 
 * 💡 COMO USAR NO HTML:
 * <app-icon name="lucideCar" class="w-5 h-5 text-indigo-400" />
 * 
 * - `name`: Obrigatório. Deve ser exatamente o nome do ícone registrado abaixo (ex: 'lucideTag').
 * - `class`: Use classes do Tailwind para definir tamanho (w-X h-X) e cor (text-X). 
 *            O SVG herda a cor do texto automaticamente (`currentColor`).
 * 
 * ⚠️ ATENÇÃO (VÍNCULO COM O CATÁLOGO):
 * Se você criou um item novo no arquivo `icons.ts` (AVAILABLE_ICONS), é OBRIGATÓRIO
 * importá-lo e adicioná-lo ao `provideIcons` logo abaixo. 
 * =========================================================================================
*/

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [ // Registro de icones         
    provideIcons({
      lucideShoppingCart, lucideCar, lucideHome, lucideUtensils,
      lucideGamepad2, lucideAntenna,  lucideBriefcase, lucideLaptop, lucidePiggyBank, lucideGift,
      lucideCarTaxiFront, lucideZap, lucideFactory, lucideLandmark, lucideHeartPulse, lucideGraduationCap, lucidePlane,
      lucideRepeat, lucideDumbbell, lucideSmartphone, lucideCoffee, lucideArrowDownLeft, lucideArrowUpRight,
      lucideTag
    })
  ],
  template: `<ng-icon [name]="name" />`,
  host: {
    'class': 'inline-flex items-center justify-center' // Garante alinhamento
  }
})
export class IconComponent {
  @Input({ required: true }) name!: string;
}