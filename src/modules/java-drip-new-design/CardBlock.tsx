import { FC } from 'react';
import classNames from 'classnames';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseCardBlock, { CardBlockProps, CardBlockVariants } from '../../canvas/CardBlock';
import { metrophobic } from '../../fonts';

const CardBlock: FC<CardBlockProps> = props => {
  const { textColorVariant } = props;
  return (
    <BaseCardBlock
      {...props}
      styles={{
        container: classNames('tracking-[5.5px]', metrophobic?.className, 'text-secondary-content', {
          '!text-secondary': textColorVariant === 'Light',
        }),
      }}
    />
  );
};

[undefined, CardBlockVariants.Carousel].forEach(variantId => {
  registerUniformComponent({
    type: 'cardBlock',
    component: CardBlock,
    variantId,
  });
});
