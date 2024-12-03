import { FC } from 'react';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseCallToAction, { CallToActionProps, CallToActionVariant } from '../../canvas/CallToAction';
import { metrophobic } from '../../fonts';

const CallToAction: FC<CallToActionProps> = props => (
  <BaseCallToAction
    {...props}
    styles={{
      container: metrophobic.className,
    }}
  />
);

[
  undefined,
  CallToActionVariant.AlignLeft,
  CallToActionVariant.AlignLeft,
  CallToActionVariant.AlignRight,
  CallToActionVariant.Featured,
].forEach(variantId => {
  registerUniformComponent({
    type: 'callToAction',
    component: CallToAction,
    variantId,
  });
});
