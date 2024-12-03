import { FC } from 'react';
import classNames from 'classnames';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseCard, { CardVariants, CardProps } from '../../canvas/Card';

const Card: FC<CardProps> = props => {
  const { component, textColorVariant = 'Light' } = props || {};

  return (
    <BaseCard
      {...props}
      textColorVariant={textColorVariant}
      styles={{
        title: classNames({ 'text-secondary': component.variant === CardVariants.Featured }),
        container: classNames({ 'border-none': component.variant === CardVariants.BackgroundImage }),
      }}
    />
  );
};

[undefined, CardVariants.BackgroundImage, CardVariants.Featured].forEach(variantId => {
  registerUniformComponent({
    type: 'card',
    component: Card,
    variantId,
  });
});
