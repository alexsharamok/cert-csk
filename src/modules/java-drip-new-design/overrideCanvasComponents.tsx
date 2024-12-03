import { ComponentType } from 'react';
import { ComponentProps } from '@uniformdev/canvas-react';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import getOverriddenProductInfo from './ProductInfo';
import getOverriddenShoppingCartIcon from './ShoppingCartIcon';
import getOverriddenProfileIcon from './ProfileIcon';
import getOverriddenSegmentProfileContent from './SegmentProfileContent';
import getOverriddenUserProfileContent from './UserProfileContent';
import getOverriddenCoveoResultList from './CoveoResultList';
import getOverriddenAlgoliaHits from './AlgoliaHits';
import getOverriddenSearchEntryResultList from './SearchEntryResultList';
import getOverriddenOrderHistory from './OrderHistory';

const componentMappings: {
  [key: string]: <T>(Component: ComponentType<ComponentProps<T>>) => ComponentType<ComponentProps<T>>;
} = {
  productInfo: getOverriddenProductInfo,
  shoppingCartIcon: getOverriddenShoppingCartIcon,
  profileIcon: getOverriddenProfileIcon,
  segmentProfileContent: getOverriddenSegmentProfileContent,
  userProfileContent: getOverriddenUserProfileContent,
  orderHistory: getOverriddenOrderHistory,
  'coveo-resultList': getOverriddenCoveoResultList,
  'algolia-hits': getOverriddenAlgoliaHits,
  searchEntryResultList: getOverriddenSearchEntryResultList,
};

export const overrideCanvasComponents = ({
  type,
  component,
  variantId,
}: {
  type: string;
  variantId?: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<ComponentProps<any>>;
}) => {
  const componentToRegister = componentMappings[type]?.(component) || component;
  registerUniformComponent({ type, component: componentToRegister, variantId });
};
