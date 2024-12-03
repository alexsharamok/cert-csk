import { ComponentType } from 'react';
import classNames from 'classnames';
import { ComponentProps } from '@uniformdev/canvas-react';

import { CardVariants } from '../../canvas/Card';

const getOverriddenCoveoResultList =
  <T,>(Component: ComponentType<ComponentProps<T>>): ComponentType<ComponentProps<T>> =>
  (props: ComponentProps<T>) => {
    const component = props.component?.slots?.resultItemComponent?.[0];

    return (
      <Component
        {...props}
        itemStyles={{
          title: classNames({ 'text-secondary': component?.variant === CardVariants.Featured }),
          container: classNames({ 'border-none': component?.variant === CardVariants.BackgroundImage }),
        }}
      />
    );
  };

export default getOverriddenCoveoResultList;
