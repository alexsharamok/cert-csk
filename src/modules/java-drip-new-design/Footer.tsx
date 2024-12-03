import { FC } from 'react';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseFooter, { FooterProps } from '../../canvas/_navigation/Footer';
import { metrophobic } from '../../fonts';

const Footer: FC<FooterProps> = props => (
  <BaseFooter
    {...props}
    styles={{
      container: metrophobic.className,
      footerSection: '!border-t-0',
      buildTimestamp: 'text-secondary-content',
    }}
  />
);

registerUniformComponent({
  type: 'footer',
  component: Footer,
});
