import {
  FC,
  Dispatch,
  SetStateAction,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import {
  getAllAvailableFiltersForEntry,
  mapCanvasParameters,
  mapUniformContentEntryFields,
  useGetSearchEngine,
} from './utils';
import { ComponentProps } from '@uniformdev/canvas-react';
import { FilterBy } from './EntryFilterBox';
import { useComponentStarterKitContext } from '../../context/ComponentStarterKitContext';

const ENTRY_SEARCH_ENDPOINT = '/api/getEntries';
export const ARRAY_OPERATORS = ['in', 'nin'];

interface UniformEntrySearchContextProps {
  search: string;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  currentPage: number;
  allPossibleFilters: EntrySearch.PossibleEntryFilters;
  avaliableFilters: EntrySearch.PossibleEntryFilters;
  setSearch: Dispatch<SetStateAction<string>>;
  filterBy: FilterBy[];
  setFilterBy: Dispatch<SetStateAction<FilterBy[]>>;
  setAdditionalFilters: Dispatch<SetStateAction<Record<string, unknown>>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  resultEntries: EntrySearch.EntryResultItem[] | undefined;
  isResultPrefetched?: boolean;
}

export const UniformEntrySearchContext = createContext<UniformEntrySearchContextProps>({
  search: '',
  pageSize: 50,
  totalPages: 0,
  totalCount: 0,
  currentPage: 0,
  filterBy: [],
  allPossibleFilters: {},
  avaliableFilters: {},
  setFilterBy: () => null,
  setSearch: () => null,
  setAdditionalFilters: () => null,
  setCurrentPage: () => null,
  isLoading: false,
  resultEntries: [] || undefined,
  isResultPrefetched: false,
});

export type UniformEntrySearchContextProviderProps = {
  initialFilters?: EntrySearch.UniformBlockValue[];
  pageSize?: string;
  children: ReactNode;
};

type InitialSearchResults = {
  avaliableFilters: EntrySearch.PossibleEntryFilters;
  resultEntries: EntrySearch.EntryResultItem[] | undefined;
  totalCount: number;
  filterBy: FilterBy[];
};

const UniformEntrySearchContextProvider: FC<ComponentProps<UniformEntrySearchContextProviderProps>> = ({
  initialFilters,
  pageSize: initPageSize,
  children,
}) => {
  const { initialSearchResults } = useComponentStarterKitContext();  

  const {
    filterBy: initialFilterBy = [],
    avaliableFilters: initialAvalibleFilters = {},
    totalCount: initialTotalCount = 0,
    resultEntries: initialResultEntries = undefined,
  } = (initialSearchResults as InitialSearchResults) || {};

  const { locale = 'en-US' } = useRouter();
  const pageSize = Number(initPageSize);

  const hasInitialResults = !!initialTotalCount;

  const [isResultPrefetched] = useState<boolean>(hasInitialResults);

  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(!hasInitialResults);

  const [search, setSearch] = useState<string>('');
  const [filterBy, setFilterBy] = useState<FilterBy[]>(initialFilterBy);
  const [allPossibleFilters, setAllPossibleFilters] =
    useState<EntrySearch.PossibleEntryFilters>(initialAvalibleFilters);
  const [avaliableFilters, setAvaliableFilters] = useState<EntrySearch.PossibleEntryFilters>(initialAvalibleFilters);
  const [additionalFilters, setAdditionalFilters] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState<boolean>(!hasInitialResults);
  const [resultEntries, setResultEntries] = useState<EntrySearch.EntryResultItem[] | undefined>(initialResultEntries);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount || 0);

  const searchEngine = useGetSearchEngine<EntrySearch.ArticleEntry | EntrySearch.ProductEntry>({
    endpoint: ENTRY_SEARCH_ENDPOINT,
    setResultEntries,
    setAvaliableFilters,
    filterBy,
    setTotalCount,
    setIsLoading,
    mapUniformContentEntryFields,
  });

  console.log('filterBy', filterBy);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize]);

  const baseFilter = useMemo(
    () =>
      initialFilters
        ?.map(({ fields, _id }, index) => mapCanvasParameters<EntrySearch.FilterBlock>(fields, _id || String(index)))
        .reduce<Record<string, unknown>>((acc, { key, operator, value }) => {
          acc[key] = ARRAY_OPERATORS.includes(operator) ? { [operator]: value.split('|') } : { [operator]: value };
          return acc;
        }, {}) || {},
    [initialFilters]
  );

  console.log('initial filters', filterBy);

  useEffect(() => {
    if (!filterBy.length || isResultPrefetched) return;

    getAllAvailableFiltersForEntry({
      endpoint: ENTRY_SEARCH_ENDPOINT,
      body: {
        filters: { ...baseFilter },
        locale,
      },
      fields: filterBy,
    }).then(setAllPossibleFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBy, isResultPrefetched]);

  useEffect(() => {    
    if (!isSearchEnabled) return;
    setIsLoading(true);
    searchEngine({
      filters: { ...baseFilter, ...additionalFilters },
      locale,
      withTotalCount: true,
      limit: pageSize,
      offset: currentPage * pageSize,
      ...(search ? { search } : undefined),
    });
  }, [additionalFilters, baseFilter, currentPage, locale, pageSize, search, searchEngine, isSearchEnabled]);
  

  const handleEnableSearch = useCallback(
    <T,>(setCallback: Dispatch<SetStateAction<T>>) =>
      (props: SetStateAction<T>) => {
        setIsSearchEnabled(true);
        setCallback(props);
      },
    []
  );

  const value = useMemo(
    () => ({
      search,
      pageSize,
      currentPage,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      isLoading,
      allPossibleFilters,
      avaliableFilters,
      resultEntries,
      setSearch: handleEnableSearch(setSearch),
      setAdditionalFilters: handleEnableSearch(setAdditionalFilters),
      setCurrentPage,
      filterBy,
      setFilterBy,
      isResultPrefetched,
    }),
    [
      search,
      pageSize,
      currentPage,
      totalCount,
      isLoading,
      resultEntries,
      allPossibleFilters,
      avaliableFilters,
      setAdditionalFilters,
      filterBy,
      setFilterBy,
      isResultPrefetched,
      setSearch,
      handleEnableSearch,
    ]
  );

  return <UniformEntrySearchContext.Provider value={value}>{children}</UniformEntrySearchContext.Provider>;
};

export default UniformEntrySearchContextProvider;

export const useUniformEntrySearchContext = () => useContext(UniformEntrySearchContext);
