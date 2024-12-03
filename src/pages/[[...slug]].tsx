import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE, EntryData, ContentClient, flattenValues } from '@uniformdev/canvas';
import { withUniformGetStaticProps, prependLocale } from '@uniformdev/canvas-next/route';
import { getBreadcrumbs, getProjectMapClient, getRouteClient, getContentClient } from '../utilities/canvas/canvasClients';
export { default } from '../components/BasePage';

// @ts-ignore: It is assumed that each application implements the modules at the appropriate location
import { getFilterValues, mapUniformContentEntryFields } from '@/modules/search/utils';
// @ts-ignore: It is assumed that each application implements the modules at the appropriate location
import { FilterBy } from '@/modules/search/EntryFilterBox';
// @ts-ignore: It is assumed that each application implements the modules at the appropriate location
import { ARRAY_OPERATORS } from '@/modules/search/UniformEntrySearchProvider';
// @ts-ignore: It is assumed that each application implements the localeSettings json at the appropriate location
import localizationSettings from '@/context/locales.json';
// @ts-ignore: It is assumed that each application implements the utilities at the appropriate location
import { findSlotsWithType } from '@/utilities';

// Doc: https://docs.uniform.app/docs/guides/composition/url-management/routing/slug-based-routing

const getMemoizedContentClient = (() => {
  let canvasClient: ContentClient;
  return () => {
    if (!canvasClient) canvasClient = getContentClient();
    return canvasClient;
  };
})();

export const getStaticProps = withUniformGetStaticProps({
  requestOptions: context => ({
    state:
      Boolean(context.preview) || process.env.NODE_ENV === 'development' ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  }),
  param: 'slug',
  client: getRouteClient(),
  modifyPath: prependLocale,
  handleComposition: async (routeResponse, _context) => {
    const { composition, errors } = routeResponse.compositionApiResponse || {};

    if (errors?.some(e => e.type === 'data' || e.type === 'binding')) {
      return { notFound: true };
    }

    const preview = Boolean(_context.preview);
    const slug = _context.params?.slug;
    const breadcrumbs = await getBreadcrumbs({
      compositionId: composition._id,
      preview,
      dynamicTitle: composition?.parameters?.pageTitle?.value as string,
      urlSegments: typeof slug === 'string' ? slug?.split('/') : slug,
    });

    const uniformEntrySearchEngine = findSlotsWithType(composition, 'uniformEntrySearchEngine');

    const _locale = _context.locale || _context.defaultLocale || 'en-US';

    //When we have a search engine component in the composition, we need to fetch initial the search results
    let initialSearchResults = {};
    if (uniformEntrySearchEngine) {
      const entryFilterBox = findSlotsWithType(composition, 'entryFilterBox');

      const initialFiltersValue: EntryData[] = uniformEntrySearchEngine.parameters?.initialFilters
        ?.value as EntryData[];

      const filterByValue = entryFilterBox?.parameters?.filterBy?.value as EntryData[];

      const filterBy = filterByValue?.map((filter: EntryData) => flattenValues(filter)) || [];

      const initialFilters = initialFiltersValue
        .map((filter: EntryData) => flattenValues(filter) as { key: string; operator: string; value: string })
        .reduce<Record<string, unknown>>((acc, { key, operator, value }) => {
          acc[key] = ARRAY_OPERATORS.includes(operator) ? { [operator]: value.split('|') } : { [operator]: value };
          return acc;
        }, {});

      const response = await getMemoizedContentClient().getEntries({
        filters: { ...initialFilters },
        withTotalCount: true,
        locale: _locale,
      });

      const { entries = [], totalCount = 0 } = response;
      const resultEntries = entries.map(mapUniformContentEntryFields);

      const avaliableFilters = getFilterValues(resultEntries, filterBy as FilterBy[]);

      initialSearchResults = {
        avaliableFilters,
        resultEntries,
        totalCount,
        filterBy,
      };
    }

    const translations = await import(`@/locales/${_context.locale || 'en-US'}.json`)
      .then(m => m.default)
      .catch(() => ({}));

    return {
      props: { 
        preview, 
        data: composition || null,
        context: { breadcrumbs, initialSearchResults },
        localizationSettings,
        translations,
      },
    };
  },
});

export const getStaticPaths = async () => {
  const { nodes } = await getProjectMapClient().getNodes({
    state: process.env.NODE_ENV === 'development' ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  });

  return {
    paths: nodes?.reduce((acc: string[], { path, type }) => (type === 'composition' ? [...acc, path] : acc), []) || [],
    fallback: 'blocking',
  };
};
