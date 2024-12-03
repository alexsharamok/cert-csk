import { FC } from 'react';
import classNames from 'classnames';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import BaseImageGallery, { BaseImageGalleryProps } from '../../canvas/ImageGallery';
import { metrophobic } from '../../fonts';
import { ContainerVariants } from '../../components/Container';

const ImageGallery: FC<BaseImageGalleryProps> = props => (
  <BaseImageGallery
    {...props}
    styles={{
      title: classNames('tracking-[5.5px]', metrophobic.className),
      description: metrophobic.className,
    }}
  />
);

[undefined, ContainerVariants.BackgroundInContainer, ContainerVariants.FluidContent].forEach(variantId => {
  registerUniformComponent({
    type: 'imageGallery',
    component: ImageGallery,
    variantId,
  });
});
