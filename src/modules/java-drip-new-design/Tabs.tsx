import { FC } from 'react';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseTabs, { TabsVariant, TabsProps } from '../../canvas/Tabs';
import { metrophobic } from '../../fonts';

const Tabs: FC<TabsProps> = props => (
  <BaseTabs
    {...props}
    styles={{
      container: metrophobic.className,
    }}
  />
);

[undefined, TabsVariant.Bordered, TabsVariant.Lifted, TabsVariant.Boxed].forEach(variantId => {
  registerUniformComponent({
    type: 'tabs',
    component: Tabs,
    variantId,
  });
});
