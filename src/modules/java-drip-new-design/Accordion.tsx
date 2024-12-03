import { FC } from 'react';
import classNames from 'classnames';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseAccordion, { AccordionProps } from '../../canvas/Accordion';
import { metrophobic } from '../../fonts';

const Accordion: FC<AccordionProps> = props => (
  <BaseAccordion
    {...props}
    styles={{
      container: '!text-primary-content',
      title: classNames('tracking-[5.5px]', metrophobic.className),
    }}
  />
);

registerUniformComponent({
  type: 'accordion',
  component: Accordion,
});
