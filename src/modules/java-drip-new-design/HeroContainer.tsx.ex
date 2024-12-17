import { FC } from 'react';
import classNames from 'classnames';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import CanvasBaseHero, { HeroContainerVariant, HeroContainerProps } from '../../canvas/HeroContainer';
import { metrophobic } from '../../fonts';

const HeroContainer: FC<HeroContainerProps> = props => {
  const { component } = props || {};
  return (
    <CanvasBaseHero
      {...props}
      styles={{
        eyebrowText: classNames(metrophobic.className, 'text-xl text-secondary', {
          '!tracking-[5.5px] font-bold': component.variant === HeroContainerVariant.BackgroundImage,
        }),
        description: classNames(metrophobic.className, 'text-xl', {
          'tracking-[5.5px] uppercase !py-0': component.variant === HeroContainerVariant.BackgroundImage,
          'pt-14 pb-10': [HeroContainerVariant.ImageLeft, HeroContainerVariant.ImageRight].includes(
            component.variant as HeroContainerVariant
          ),
          'text-secondary': component.variant === HeroContainerVariant.TwoColumns,
        }),
        descriptionSeparator: 'flex justify-center my-5 mx-auto bg-secondary h-1 w-24',
        sideImage: 'w-[320px] md:!w-[700px] [&>*]:rounded-none',
        textAlign: classNames({ 'text-end': component.variant === HeroContainerVariant.ImageRight }),
      }}
    />
  );
};

[
  undefined,
  HeroContainerVariant.ImageLeft,
  HeroContainerVariant.ImageRight,
  HeroContainerVariant.BackgroundImage,
  HeroContainerVariant.TwoColumns,
].forEach(variantId => {
  registerUniformComponent({
    type: 'heroContainer',
    component: HeroContainer,
    variantId,
  });
});
