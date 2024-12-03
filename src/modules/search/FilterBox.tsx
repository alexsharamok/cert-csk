import { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import { withErrorCallout } from '../../hocs/withErrorCallout';
import { ARRAY_OPERATORS, useUniformEntrySearchContext } from './UniformEntrySearchProvider';
import { mapCanvasParameters } from './utils';

type FilterBoxProps = {
  title: string;
  filters?: EntrySearch.UniformBlockValue[];
};

const FilterBox: FC<ComponentProps<FilterBoxProps>> = ({ title, filters }) => {
  const [selectedFilterId, setSelectedFilterId] = useState<string>('');
  const [showTotalCount, setShowTotalCount] = useState(false);
  const { setAdditionalFilters, totalCount, isLoading } = useUniformEntrySearchContext();

  useEffect(() => {
    if (!isLoading) setShowTotalCount(true);
  }, [isLoading]);

  const filtersToDisplay =
    filters?.map(({ fields, _id }, index) =>
      mapCanvasParameters<EntrySearch.FilterBlock>(fields, _id || String(index))
    ) || [];

  useEffect(() => {
    const { key, operator, value } = filtersToDisplay.find(item => item.id === selectedFilterId) || {};
    setAdditionalFilters(
      key && operator && value
        ? {
            [key]: {
              [operator]: ARRAY_OPERATORS.includes(operator) ? value.split('|') : value,
            },
          }
        : {}
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilterId, setAdditionalFilters]);

  const handleFilterSelect = useCallback(
    (selectedId: string) => () => {
      setShowTotalCount(false);
      setSelectedFilterId(prevState => (prevState === selectedId ? '' : selectedId));
    },
    []
  );

  return (
    <div className="w-full flex justify-center">
      <div className="pt-12 pr-10 inline-flex flex-col lg:w-full first:pt-2 min-h-[250px]">
        <span className="font-extrabold text-lg capitalize text-black">{title}</span>
        {filtersToDisplay.map(({ id, filterName }) => (
          <button
            key={id}
            className={classNames('mt-4 px-2 hover:opacity-30 text-secondary-content', {
              'rounded whitespace-nowrap py-1.5 px-2 hover:opacity-30 text-white bg-primary my-1 text-primary-content':
                selectedFilterId === id,
            })}
            onClick={handleFilterSelect(id)}
          >
            <label className="cursor-pointer flex gap-2 justify-between items-center pr-3 truncate">
              {filterName}
              {selectedFilterId === id && !isLoading && showTotalCount && (
                <div className="bg-secondary text-secondary-content rounded-full px-2">{totalCount}</div>
              )}
            </label>
          </button>
        ))}
      </div>
    </div>
  );
};

registerUniformComponent({
  type: 'filterBox',
  component: withErrorCallout(
    FilterBox,
    'Something went wrong. Please use Filter Box components only inside the Uniform Entry Search Engine component'
  ),
});

export default FilterBox;
