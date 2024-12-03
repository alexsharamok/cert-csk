import { FC } from 'react';
import classNames from 'classnames';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseBreadcrumbs, { BreadcrumbsProps } from '../../canvas/Breadcrumbs';
import { metrophobic } from '../../fonts';

const Breadcrumbs: FC<BreadcrumbsProps> = props => (
  <BaseBreadcrumbs
    {...props}
    styles={{
      container: classNames(metrophobic.className, 'py-3'),
    }}
  />
);

registerUniformComponent({
  type: 'breadcrumbs',
  component: Breadcrumbs,
});
