import { FC, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import classNames from 'classnames';
import { ComponentInstance } from '@uniformdev/canvas';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import { useUniformEntrySearchContext } from './UniformEntrySearchProvider';
import InformationContent from '../../components/InformationContent';
import Card from '../../canvas/Card';
import { withErrorCallout } from '../../hocs/withErrorCallout';
import { SearchItemSkeleton } from './SearchItemSkeleton';

export type EntryStyles = {
  title?: string;
  description?: string;
  container?: string;
  image?: string;
  cardBody?: string;
};

const formatEntryItem = (entry: EntrySearch.EntryResultItem) => {
  switch (entry.contentType) {
    case 'product': {
      const productEntry = entry as EntrySearch.ProductEntry;

      const [category] = productEntry.category?.map(category => category?.title?.toUpperCase()).filter(Boolean) || [];

      return {
        image: productEntry.primaryImage?.[0].url,
        title: productEntry.name,
        description: productEntry.shortDescription || '',
        badge: category,
        slug: entry.slug,
      };
    }
    case 'article': {
      const articleEntry = entry as EntrySearch.ArticleEntry;
      return {
        image: articleEntry?.thumbnail?.[0].url,
        title: articleEntry.title,
        description: articleEntry.description || '',
        badge: articleEntry.source?.title?.toUpperCase(),
        slug: entry.slug,
      };
    }
    default: {
      return {
        image: '',
        title: '',
        description: '',
        badge: '',
        slug: '',
      };
    }
  }
};

const EntryItem: FC<{
  entry: EntrySearch.EntryResultItem;
  component: ComponentInstance;
  entryStyles?: EntryStyles;
}> = ({ entry, component, entryStyles }) => {
  const {
    buttonStyle,
    buttonLink,
    buttonCopy,
    badgeSize,
    badgeStyle,
    buttonAnimationType,
    lineCountRestriction,
    objectFit,
    overlayColor,
    overlayOpacity,
    textColorVariant,
    animationType,
    duration,
    delay,
    animationPreview,
  } = component.parameters || {};

  const { image, title, description, badge, slug } = formatEntryItem(entry);

  return (
    <Card
      image={image}
      title={title}
      description={description}
      badge={badge}
      badgeStyle={(badgeStyle?.value as Types.BadgeStyles) || 'primary'}
      buttonStyle={(buttonStyle?.value as Types.ButtonStyles) || 'primary'}
      lineCountRestriction={(lineCountRestriction?.value as Types.AvailableMaxLineCount) || '5'}
      badgeSize={(badgeSize?.value as Types.BadgeSize) || 'sm'}
      buttonCopy={buttonCopy?.value as string}
      objectFit={objectFit?.value as Types.AvailableObjectFit}
      overlayColor={overlayColor?.value as Types.AvailableColor}
      overlayOpacity={overlayOpacity?.value as Types.AvailableOpacity}
      buttonAnimationType={buttonAnimationType?.value as Types.AnimationType}
      buttonLink={
        // Emulate dynamic values for categories pages without dynamic input feature
        buttonLink?.value
          ? ({
              ...(buttonLink?.value as Types.ProjectMapLink),
              dynamicInputValues: {
                [`${entry.contentType}-slug`]: slug,
              },
            } as Types.ProjectMapLink)
          : undefined
      }
      useCustomTextElements
      textColorVariant={textColorVariant?.value as Types.AvailableTextColorVariant | undefined}
      component={component}
      animationType={animationType?.value as Types.AnimationType}
      duration={duration?.value as Types.DurationType}
      delay={delay?.value as Types.AnimationDelay}
      animationPreview={animationPreview?.value as boolean}
      styles={{
        ...entryStyles,
        container: classNames(entryStyles?.container, 'h-full'),
      }}
    />
  );
};

type SearchResultListProps = ComponentProps<{
  entryStyles?: EntryStyles;
}>;

const SearchEntryResultList: FC<ComponentProps<SearchResultListProps>> = ({ component, entryStyles }) => {
  const t = useTranslations();
  const { resultEntries, isLoading, pageSize } = useUniformEntrySearchContext();

  const cardSkeleton = useMemo(
    () => [...Array(pageSize)].map((_, index) => <SearchItemSkeleton key={index} />),
    [pageSize]
  );

  if (resultEntries && !resultEntries.length && !isLoading) {
    return <InformationContent title={t('Sorry there are no entries for this filter') || ''} />;
  }
  return (
    <div
      className={classNames(
        'grid gap-y-3 mb-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-8 sm:gap-y-6 lg:gap-x-8 lg:gap-y-5 sm:mb-0',
        { 'opacity-50': isLoading }
      )}
    >
      {isLoading && !resultEntries
        ? cardSkeleton
        : resultEntries?.map(entry => {
            //console.log('search result item component ', JSON.stringify(component?.slots?.resultItem?.[0], null, 2));
            //console.log('search result entry ', entry);
            return (
              <EntryItem
                key={entry.id}
                entry={entry}
                entryStyles={entryStyles}
                component={component?.slots?.resultItem?.[0] || { type: 'card' }}
              />
            );
          })}
    </div>
  );
};

registerUniformComponent({
  type: 'searchEntryResultList',
  component: withErrorCallout(
    SearchEntryResultList,
    'Something went wrong. Please use Search Entry Result List components only inside the Uniform Entry Search Engine component'
  ),
});

export default SearchEntryResultList;
