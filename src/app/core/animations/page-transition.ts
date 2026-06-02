import { AnimationBuilder, createAnimation } from '@ionic/angular/standalone';

export const slideUpAnimation = (baseEl: HTMLElement) => {
  const enterAnim = createAnimation()
    .addElement(baseEl.querySelector('ion-content')!)
    .duration(280)
    .easing('cubic-bezier(0.32, 0.72, 0, 1)')
    .fromTo('transform', 'translateY(40px)', 'translateY(0)')
    .fromTo('opacity', '0', '1');

  return createAnimation().addAnimation([enterAnim]);
};

export const fadeInAnimation = (baseEl: HTMLElement) => {
  const enterAnim = createAnimation()
    .addElement(baseEl.querySelector('ion-content')!)
    .duration(200)
    .easing('ease-out')
    .fromTo('opacity', '0', '1');

  return createAnimation().addAnimation([enterAnim]);
};

export const slideInFromRightAnimation = (baseEl: HTMLElement) => {
  const enterAnim = createAnimation()
    .addElement(baseEl.querySelector('ion-content')!)
    .duration(300)
    .easing('cubic-bezier(0.36, 0, 0.66, 1)')
    .fromTo('transform', 'translateX(100%)', 'translateX(0)')
    .fromTo('opacity', '0.5', '1');

  return createAnimation().addAnimation([enterAnim]);
};
