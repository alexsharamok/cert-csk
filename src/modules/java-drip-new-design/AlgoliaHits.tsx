import { ComponentType } from 'react';
import classNames from 'classnames';
import { ComponentProps } from '@uniformdev/canvas-react';

import { CardVariants } from '../../canvas/Card';

const getOverriddenAlgoliaHits =
  <T,>(Component: ComponentType<ComponentProps<T>>): ComponentType<ComponentProps<T>> =>
  (props: ComponentProps<T>) => {
    const componentVariant = props.component?.variant;

    return (
      <Component
        {...props}
        hitStyles={{
          title: classNames({ 'text-secondary': componentVariant === CardVariants.Featured }),
          container: classNames({ 'border-none': componentVariant === CardVariants.BackgroundImage }),
        }}
      />
    );
  };

export default getOverriddenAlgoliaHits;
