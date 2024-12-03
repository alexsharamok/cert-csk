import { FC, ChangeEvent, useCallback, useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import { withErrorCallout } from '../../hocs/withErrorCallout';
import { useUniformEntrySearchContext } from './UniformEntrySearchProvider';
import { IconSearch, LoadingIcon } from './Icons';

const DEFAULT_SEARCH_DELAY = 300;

type SearchBoxProps = {
  placeholder?: string;
  searchDelay?: string;
};

const SearchBox: FC<ComponentProps<SearchBoxProps>> = ({ placeholder, searchDelay = DEFAULT_SEARCH_DELAY }) => {
  const { search, setSearch, isLoading, setAdditionalFilters } = useUniformEntrySearchContext();
  const [inputValue, setInputValue] = useState(search);
  const debouncedSearchQuery = useDebouncedCallback(
    value => setSearch(value),
    Number(searchDelay) || DEFAULT_SEARCH_DELAY
  );

  useEffect(() => {
    if (search !== inputValue) {
      setInputValue(search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      debouncedSearchQuery(event.target.value);
      setAdditionalFilters({});
    },
    [debouncedSearchQuery, setAdditionalFilters]
  );

  return (
    <div className="relative w-full">
      <input
        type="text"
        onChange={handleSearchChange}
        value={inputValue}
        placeholder={placeholder}
        className="w-full rounded-md border border-primary focus:border-primary focus:outline-none bg-transparent px-4 py-3 pr-10 text-sm font-medium placeholder:font-medium text-black placeholder:text-gray"
      />
      <span className="absolute right-8 xl:right-4 top-1/2 h-4 w-4 -translate-y-1/2 transform">
        {isLoading ? <LoadingIcon className="fill-primary" /> : <IconSearch className="fill-primary" />}
      </span>
    </div>
  );
};

registerUniformComponent({
  type: 'searchBox',
  component: withErrorCallout(
    SearchBox,
    'Something went wrong. Please use Search Box components only inside the Uniform Entry Search Engine component'
  ),
});

export default SearchBox;
