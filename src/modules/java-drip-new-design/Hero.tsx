import { FC } from 'react';
import classNames from 'classnames';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import CanvasBaseHero, { HeroVariant, HeroProps } from '../../canvas/Hero';
import { metrophobic } from '../../fonts';

const Hero: FC<HeroProps> = props => {
  const { component } = props || {};
  return (
    <CanvasBaseHero
      {...props}
      styles={{
        eyebrowText: classNames(metrophobic.className, 'text-xl text-secondary', {
          '!tracking-[5.5px] font-bold': component.variant === HeroVariant.BackgroundImage,
        }),
        description: classNames(metrophobic.className, 'text-xl', {
          'tracking-[5.5px] uppercase !py-0': component.variant === HeroVariant.BackgroundImage,
          'pt-14 pb-10': [HeroVariant.ImageLeft, HeroVariant.ImageRight].includes(component.variant as HeroVariant),
          'text-secondary': component.variant === HeroVariant.TwoColumns,
        }),
        descriptionSeparator: 'flex justify-center my-5 mx-auto bg-secondary h-1 w-24',
        sideImage: 'w-[320px] md:!w-[700px] [&>*]:rounded-none',
        textAlign: classNames({ 'text-end': component.variant === HeroVariant.ImageRight }),
      }}
    />
  );
};

[undefined, HeroVariant.ImageLeft, HeroVariant.ImageRight, HeroVariant.BackgroundImage, HeroVariant.TwoColumns].forEach(
  variantId => {
    registerUniformComponent({
      type: 'hero',
      component: Hero,
      variantId,
    });
  }
);
