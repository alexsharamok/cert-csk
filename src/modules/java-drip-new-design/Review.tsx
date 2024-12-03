import { FC } from 'react';
import classNames from 'classnames';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseReview, { ReviewVariant, ReviewProps } from '../../canvas/Review';
import { metrophobic } from '../../fonts';

const Review: FC<ReviewProps> = props => {
  const { component, picture } = props || {};
  return (
    <BaseReview
      {...props}
      styles={{
        container: '!border-b-0',
        date: 'text-secondary',
        description: component.variant ? '' : metrophobic.className,
        picture: classNames({ hidden: !picture }),
      }}
    />
  );
};

[undefined, ReviewVariant.MultiColumn].forEach(variantId =>
  registerUniformComponent({
    type: 'review',
    component: Review,
    variantId,
  })
);
