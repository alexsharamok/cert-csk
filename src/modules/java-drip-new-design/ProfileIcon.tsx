import { ComponentType } from 'react';
import { ComponentProps } from '@uniformdev/canvas-react';
import { metrophobic } from '../../fonts';

const getOverriddenProfileIcon =
  <T,>(Component: ComponentType<ComponentProps<T>>): ComponentType<ComponentProps<T>> =>
  (props: ComponentProps<T>) => (
    <Component
      {...props}
      styles={{
        link: 'hover:text-secondary',
        login: { container: metrophobic?.className },
      }}
    />
  );

export default getOverriddenProfileIcon;
