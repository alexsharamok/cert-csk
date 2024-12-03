import { FC } from 'react';
import classNames from 'classnames';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseAccordionItem, { AccordionItemProps } from '../../canvas/AccordionItem';
import { metrophobic } from '../../fonts';

const AccordionItem: FC<AccordionItemProps> = props => (
  <BaseAccordionItem
    {...props}
    styles={{
      container: 'border-secondary border-b-2',
      toggleButton: '!pl-2',
      description: classNames('!pt-0 !text-primary-content', metrophobic.className),
    }}
  />
);

registerUniformComponent({
  type: 'accordionItem',
  component: AccordionItem,
});
