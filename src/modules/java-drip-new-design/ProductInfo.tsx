import { ComponentType } from 'react';
import classNames from 'classnames';
import { ComponentProps } from '@uniformdev/canvas-react';
import { metrophobic } from '../../fonts';

const getOverriddenProductInfo =
  <T,>(Component: ComponentType<ComponentProps<T>>): ComponentType<ComponentProps<T>> =>
  (props: ComponentProps<T>) => (
    <Component
      {...props}
      styles={{
        eyebrow: classNames('tracking-[5.5px]', metrophobic?.className),
        description: metrophobic?.className,
      }}
    />
  );

export default getOverriddenProductInfo;
