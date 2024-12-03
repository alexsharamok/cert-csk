import { FC } from 'react';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import {
  HeaderLink as BaseHeaderLink,
  NavigationGroup as BaseNavigationGroup,
  NavigationMenu as BaseNavigationMenu,
  LinkProps,
} from '../../canvas/_navigation/NavLink';

const NavigationGroup: FC<LinkProps> = props => (
  <BaseNavigationGroup
    {...props}
    styles={{
      link: 'hover:text-secondary hover:!opacity-100',
      activeLink: 'text-secondary',
    }}
  />
);
const NavigationMenu: FC<LinkProps> = props => (
  <BaseNavigationMenu
    {...props}
    styles={{
      link: 'hover:text-secondary hover:!opacity-100',
      activeLink: 'text-secondary',
      mobileBackgroundType: 'custom',
    }}
  />
);

const HeaderLink: FC<LinkProps> = props => (
  <BaseHeaderLink
    {...props}
    styles={{
      link: 'hover:text-secondary hover:!opacity-100',
      activeLink: 'text-secondary',
    }}
  />
);

// default variant
registerUniformComponent({
  type: 'navigationLink',
  component: HeaderLink,
});

registerUniformComponent({
  type: 'navigationLink',
  component: HeaderLink,
  variantId: 'header',
});

registerUniformComponent({
  type: 'navigationGroup',
  component: NavigationGroup,
});

registerUniformComponent({
  type: 'navigationMenu',
  component: NavigationMenu,
});
