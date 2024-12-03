import { FC, useCallback, useEffect, useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { flattenValues, EntryData } from '@uniformdev/canvas';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import { withErrorCallout } from '../../hocs/withErrorCallout';
import { useUniformEntrySearchContext } from './UniformEntrySearchProvider';

export type FilterBy = {
  fieldName?: string;
  labelField?: string;
  exclude?: string;
};

type EntryFilterBoxProps = ComponentProps<{
  filterBy: EntryData[];
}>;

type Filters = Record<
  string,
  Array<{ label: string; value: string; isDisabled?: boolean; isDisplayPriority: boolean }>
>;
type LastClickedFilter = { type: string; action: string };
type AvailableFilters = Array<{ type: string; action: string; values: Filters }>;
type AvailableByCategory = Filters;

const EntryFilterBox: FC<EntryFilterBoxProps> = ({ filterBy }) => {
  const [showTotalCount, setShowTotalCount] = useState(false);
  const {
    setAdditionalFilters,
    totalCount,
    setFilterBy,
    isLoading,
    allPossibleFilters,
    avaliableFilters,
    resultEntries,
    setSearch,
    isResultPrefetched,
    search,
  } = useUniformEntrySearchContext();

  const lastClickedFilter = useRef<LastClickedFilter>({ type: '', action: '' });
  const selectedFilters = useRef<Record<string, string>>({});
  const [filters, setFilters] = useState<AvailableByCategory>(allPossibleFilters);
  const [availableByCategory, setAvailableByCategory] = useState<AvailableFilters>([]);

  const formattedFilterBy = useMemo(() => filterBy.map(filter => flattenValues(filter) as FilterBy), [filterBy]);
  const isFilterLoading = isLoading && (!Object.keys(allPossibleFilters).length || !resultEntries);

  const displayFilters = useMemo(
    () =>
      Object.entries(filters).reduce<Filters>((acc, [category, filterNames]) => {
        const filteredFacets = filterNames.sort((a, b) => {
          // First sort by isDisplayPriority
          if (a.isDisplayPriority !== b.isDisplayPriority) {
            return a.isDisplayPriority ? -1 : 1;
          }

          // Then sort alphabetically by label if isDisplayPriority is the same
          return a.label.localeCompare(b.label);
        });

        return { ...acc, [category]: filteredFacets };
      }, {}),
    [filters]
  );

  useEffect(() => {
    //When we have result prefetched, we don't need to set the filterBy, it call the search engine automatically
    if (isResultPrefetched) return;

    setFilterBy(formattedFilterBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedFilterBy, setFilterBy]);

  useEffect(() => {
    setFilters(allPossibleFilters);
  }, [allPossibleFilters]);

  useEffect(() => {
    if (!lastClickedFilter.current.action || isLoading) return;
    setAvailableByCategory(prev => [
      ...prev,
      {
        type: lastClickedFilter.current.type,
        action: lastClickedFilter.current.action,
        values: avaliableFilters,
      },
    ]);
  }, [avaliableFilters, isLoading]);

  useEffect(() => {
    if (search) {
      selectedFilters.current = {};
      setFilters(allPossibleFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const updateFilters = useCallback(() => {
    const newFilters = Object.entries(filters).reduce<Filters>((acc, [category, filterNames]) => {
      const isOneFilterSelected =
        Object.values(selectedFilters.current).filter(Boolean).length === 1 && filterBy.length > 1;
      const categoryOfSelectedFilter = Object.entries(selectedFilters.current).find(([, value]) => value)?.[0];
      const filtersToApply = availableByCategory[availableByCategory.length - 1];

      const updatedFilterNames = filterNames.map(filterName => {
        if (isOneFilterSelected && categoryOfSelectedFilter === category) {
          return { ...filterName, isDisabled: false };
        }

        if (category === filtersToApply?.type && filtersToApply?.action === 'add') {
          return filterName;
        }

        const isFilterDisabled =
          filtersToApply?.values[category]?.findIndex(filter => filter.value === filterName.value) === -1;

        return { ...filterName, isDisabled: isFilterDisabled };
      });

      return { ...acc, [category]: updatedFilterNames };
    }, {});

    setFilters(newFilters);
  }, [filters, availableByCategory, filterBy.length]);

  useEffect(() => {
    updateFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableByCategory]);

  useEffect(() => {
    if (!isLoading) setShowTotalCount(true);
  }, [isLoading]);

  const handleFilterSelect = useCallback(
    (category: string, filterName: string) => {
      setSearch('');
      lastClickedFilter.current = {
        type: category,
        action: selectedFilters.current[category] === filterName ? 'remove' : 'add',
      };
      setShowTotalCount(false);

      selectedFilters.current = {
        ...selectedFilters.current,
        [category]: selectedFilters.current[category] === filterName ? '' : filterName,
      };

      const filtersToApply = Object.entries(selectedFilters.current).reduce<Record<string, { eq: string }>>(
        (acc, [key, value]) => {
          if (value) acc[`fields.${key}`] = { eq: value };
          return acc;
        },
        {}
      );

      setAdditionalFilters(filtersToApply);
    },
    [setAdditionalFilters, setSearch]
  );

  return (
    <div className="w-full flex justify-center">
      <div className="pt-12 pr-10 inline-flex flex-col lg:w-full first:pt-2 gap-8 min-h-[250px]">
        {isFilterLoading
          ? [...Array(2)].map((_, index) => (
              <div key={`filter-category-skeleton-${index}`} className="inline-flex flex-col animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4" />
                {[...Array(5)].map((_, subIndex) => (
                  <div key={`filter-skeleton-${index}-${subIndex}`} className="mt-4 px-2">
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ))
          : Object.entries(displayFilters).map(([category, filterNames]) => (
              <div className="inline-flex flex-col" key={category}>
                <span className="font-extrabold text-lg capitalize text-black">{category}</span>
                {filterNames.map(filterName => (
                  <button
                    key={filterName.value}
                    className={classNames('mt-2 px-2 hover:opacity-30 text-secondary-content py-1', {
                      'rounded whitespace-nowrap px-2 hover:opacity-30 text-white bg-primary text-primary-content':
                        selectedFilters.current[category] === filterName.value,
                      'opacity-50 hover:!opacity-50': filterName.isDisabled,
                      'opacity-70 hover:!opacity-70': isLoading,
                    })}
                    disabled={filterName.isDisabled}
                    onClick={
                      !filterName.isDisabled && !isLoading
                        ? () => handleFilterSelect(category, filterName.value)
                        : undefined
                    }
                  >
                    <label
                      className={classNames('cursor-pointer flex gap-2 justify-between items-center pr-3 truncate', {
                        '!cursor-not-allowed': filterName.isDisabled,
                        '!cursor-progress': isLoading,
                      })}
                    >
                      {filterName.label}
                      {selectedFilters.current[category] === filterName.value && !isLoading && showTotalCount && (
                        <div className="bg-secondary text-secondary-content rounded-full px-2">{totalCount}</div>
                      )}
                    </label>
                  </button>
                ))}
              </div>
            ))}
      </div>
    </div>
  );
};

registerUniformComponent({
  type: 'entryFilterBox',
  component: withErrorCallout(
    EntryFilterBox,
    'Something went wrong. Please use Filter Box components only inside the Uniform Entry Search Engine component'
  ),
});

export default EntryFilterBox;
