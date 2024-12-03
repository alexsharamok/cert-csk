import { FC } from 'react';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseRichText, { RichTextProps } from '../../canvas/_atoms/RichText';

const RichText: FC<RichTextProps> = props => (
  <BaseRichText
    {...props}
    styles={{
      content: 'font-sans',
    }}
  />
);

registerUniformComponent({
  type: 'richText',
  component: RichText,
});
