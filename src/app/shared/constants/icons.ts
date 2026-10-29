/**
 * =========================================================================================
 * ARQUIVO DE CONSTANTES DE ÍCONES
 * =========================================================================================
 * Este arquivo é o "catálogo" de ícones que o usuário pode escolher na interface (UI).
 * 
 * 💡 COMO USAR:
 * Importe `AVAILABLE_ICONS` em qualquer componente que precise renderizar uma lista de 
 * ícones (como o seletor de ícones na tela de categorias).
 * 
 * ⚠️ ATENÇÃO (VÍNCULO COM O COMPONENTE DE ÍCONE):
 * Se adicionar um NOVO ícone nesta lista, TAMBÉM PRECISA importá-lo e 
 * registrá-lo no arquivo `icon.component.ts` (na lista do `provideIcons`). 
 * Caso contrário, o ícone aparecerá em branco na tela.
 * =========================================================================================
 */

export interface IconOption {
  name: string;
  label: string;
}

export const AVAILABLE_ICONS: IconOption[] = [
  { name: 'lucideShoppingCart', label: 'Compras' },
  { name: 'lucideCar', label: 'Transporte' },
  { name: 'lucideHome', label: 'Moradia' },
  { name: 'lucideUtensils', label: 'Alimentação' },
  { name: 'lucideGamepad2', label: 'Lazer' },
  { name: 'lucideAntenna', label: 'TV' },
  { name: 'lucideBriefcase', label: 'Trabalho' },
  { name: 'lucideLaptop', label: 'Computador' },
  { name: 'lucidePiggyBank', label: 'Investimentos' },
  { name: 'lucideGift', label: 'Presentes' },
  { name: 'lucideCarTaxiFront', label: 'TransporteApp' },
  { name: 'lucideZap', label: 'Contas' },
  { name: 'lucideFactory', label: 'Industria' },
  { name: 'lucideLandmark', label: 'Governo' },
  { name: 'lucideHeartPulse', label: 'Saúde' },
  { name: 'lucideGraduationCap', label: 'Educação' },
  { name: 'lucidePlane', label: 'Viagem' },
  { name: 'lucideRepeat', label: 'Assinaturas' },
  { name: 'lucideDumbbell', label: 'Esportes' },
  { name: 'lucideSmartphone', label: 'Eletrônicos' },
  { name: 'lucideCoffee', label: 'Café' },
  { name: 'lucideArrowDownLeft', label: 'Entrada' },
  { name: 'lucideArrowUpRight', label: 'Saída' },
];