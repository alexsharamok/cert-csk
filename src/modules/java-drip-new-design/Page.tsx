import { FC } from 'react';
import BasePage, { BasePageProps } from '../../components/BasePage';
import { metrophobic } from '../../fonts';

const Page: FC<BasePageProps> = props => (
  <BasePage
    {...props}
    styles={{
      pageContentContainer: '!mb-0 !lg:mb-0',
      modal: {
        container: metrophobic.className,
      },
    }}
  />
);

export type { BasePageProps as PageProps } from '../../components/BasePage';
export default Page;
