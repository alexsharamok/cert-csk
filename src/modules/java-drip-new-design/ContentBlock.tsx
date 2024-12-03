import { FC } from 'react';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseContentBlock, { ContentBlockProps } from '../../canvas/ContentBlock';

const ContentBlock: FC<ContentBlockProps> = props => (
  <BaseContentBlock
    {...props}
    styles={{
      title: 'font-sans',
      text: 'mb-24 !pb-0 text-justify font-light !max-w-full lg:!max-w-[80%] font-sans',
    }}
  />
);

registerUniformComponent({
  type: 'content',
  component: ContentBlock,
});
