import { ComponentType } from 'react';
import { ComponentProps } from '@uniformdev/canvas-react';

const getOverriddenShoppingCartIcon =
  <T,>(Component: ComponentType<ComponentProps<T>>): ComponentType<ComponentProps<T>> =>
  (props: ComponentProps<T>) => (
    <Component
      {...props}
      styles={{
        link: 'hover:text-secondary',
      }}
    />
  );

export default getOverriddenShoppingCartIcon;
