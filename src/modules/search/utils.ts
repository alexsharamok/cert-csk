import { useDebouncedCallback } from 'use-debounce';
import { Dispatch, SetStateAction } from 'react';
import { ExceptProject } from '@uniformdev/context/api';
import { DataResolutionOption, DataResolutionParameters, Filters, GetEntriesOptions } from '@uniformdev/canvas';
import { FilterBy } from './EntryFilterBox';

const API_FETCH_LIMIT = 50;

export const mapUniformContentEntryFields = <T = { [key: string]: unknown }>(
  entryPayload: EntrySearch.UniformContentEntry
): EntrySearch.WithUniformContentEntrySystemParams<T> => {
  if (!entryPayload) return Object.freeze({}) as EntrySearch.WithUniformContentEntrySystemParams<T>;

  const { entry } = entryPayload;
  const entryFields = mapUniformContentFields(entry.fields) as T;

  return {
    ...entryFields,
    id: entry._id,
    slug: entry._slug,
    contentType: entry.type,
    created: entryPayload.created,
    modified: entryPayload.modified,
  };
};

export const mapUniformContentFields = <T = { [key: string]: unknown }>(
  fields: EntrySearch.UniformContentEntry['entry']['fields']
): T => {
  if (!fields) return {} as T;

  return Object.entries(fields).reduce<{ [key: string]: unknown }>((acc, [key, parameter]) => {
    let value = parameter.value;

    if (isUniformContentEntry(value)) {
      value = mapUniformContentEntryFields(value);
    } else if (Array.isArray(value)) {
      value = value.map(item => {
        if (item?.fields) {
          return mapUniformContentFields(item.fields);
        }
        if (isUniformContentEntry(item)) {
          return mapUniformContentEntryFields(item);
        }
        return item;
      });
    }

    acc[key] = value || null;
    return acc;
  }, {}) as T;
};

const isUniformContentEntry = (value: unknown): value is EntrySearch.UniformContentEntry => {
  return typeof value === 'object' && value !== null && 'entry' in value;
};

export const mapCanvasParameters = <T = { [key: string]: unknown }>(
  parameters: EntrySearch.ComponentInstance['parameters'],
  id: string | number
) => {
  if (!parameters) return Object.freeze({}) as T;
  const data = Object.keys(parameters).reduce<{ [key: string]: unknown }>((acc, key) => {
    const parameter = parameters[key];

    acc[key] = parameter.value;
    return acc;
  }, {}) as T;

  return { ...data, id: String(id) };
};

export const useGetSearchEngine = <T>({
  endpoint,
  setIsLoading,
  setResultEntries,
  setAvaliableFilters,
  filterBy,
  setTotalCount,
  mapUniformContentEntryFields,
  wait = 500,
}: {
  endpoint: string;
  wait?: number;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  setAvaliableFilters?: Dispatch<
    SetStateAction<Record<string, { label: string; value: string; isDisplayPriority: boolean }[]>>
  >;
  setResultEntries: Dispatch<SetStateAction<EntrySearch.WithUniformContentEntrySystemParams<T>[] | undefined>>;
  filterBy: FilterBy[];
  mapUniformContentEntryFields: (
    entryPayload: EntrySearch.UniformContentEntry
  ) => EntrySearch.WithUniformContentEntrySystemParams<T>;
  setTotalCount?: Dispatch<SetStateAction<number>>;
}) =>
  useDebouncedCallback(
    (
      body: ExceptProject<GetEntriesOptions> &
        DataResolutionParameters &
        DataResolutionOption & {
          filters?: Filters;
        }
    ) => {
      setIsLoading?.(true);
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(response => response.json())
        .then((result: EntrySearch.GetEntriesResponse) => {
          const { entries = [], totalCount = 0 } = result;
          const mappedEntries = entries.map(mapUniformContentEntryFields);

          const avaliableFilters = getFilterValues(mappedEntries, filterBy);

          setAvaliableFilters?.(avaliableFilters);
          setResultEntries(mappedEntries);
          setTotalCount?.(totalCount);
        })
        .catch(error => console.error(error))
        .finally(() => setIsLoading?.(false));
    },
    wait
  );

const fetchAllEntries = <T>(
  endpoint: string,
  body: ExceptProject<GetEntriesOptions> &
    DataResolutionParameters &
    DataResolutionOption & {
      filters?: Filters;
    }
) => {
  const fetchEntries = async <T>(offset = 0): Promise<EntrySearch.WithUniformContentEntrySystemParams<T>[]> => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        limit: API_FETCH_LIMIT,
      }),
    });

    const { entries = [], totalCount = 0 } = await response.json();

    const mappedEntries = entries.map(mapUniformContentEntryFields<EntrySearch.EntryResultItem>);

    if (totalCount > offset + API_FETCH_LIMIT) {
      const nextPart = await fetchEntries<T>(offset + API_FETCH_LIMIT);
      return [...mappedEntries, ...nextPart];
    }

    return mappedEntries;
  };

  return fetchEntries<T>();
};

export const getAllAvailableFiltersForEntry = async <T = Record<string, string[]>>({
  endpoint,
  body,
  fields,
}: {
  endpoint: string;
  body: ExceptProject<GetEntriesOptions> &
    DataResolutionParameters &
    DataResolutionOption & {
      filters?: Filters;
    };
  fields: FilterBy[];
}): Promise<EntrySearch.PossibleEntryFilters<T>> => {
  const allEntries = await fetchAllEntries<T>(endpoint, body);

  return getFilterValues<T>(allEntries, fields);
};

export const getFilterValues = <T>(
  allEntries: EntrySearch.WithUniformContentEntrySystemParams<T>[],
  fields: FilterBy[]
) => {
  return allEntries.reduce<Record<string, { label: string; value: string; isDisplayPriority: boolean }[]>>(
    (acc, entry) => {
      Object.entries(entry).forEach(([key, value]) => {
        const fieldToSearch = fields.find(({ fieldName }) => fieldName === key);

        if (fieldToSearch) {
          const excludeFromSearch = fieldToSearch.exclude?.split('|') || [];

          acc[key] = acc[key] || [];

          // Handle object values, which multi reference another content block
          if (Array.isArray(value)) {
            value.forEach(valueItem => {
              if (excludeFromSearch.includes(valueItem.id)) return;

              if (!acc[key].some(item => item.value === valueItem.id)) {
                acc[key].push({
                  label: (valueItem as Record<string, string>)[fieldToSearch.labelField || 'title'] || 'Untitled',
                  value: valueItem.id,
                  isDisplayPriority: valueItem.displayPriority || false,
                });
              }
            });
          }
          // Handle object values, which reference another content block
          else if (typeof value === 'object') {
            //FixMe: this how to avoid type casting
            const valueId = (value as Record<string, string>)?.id;

            if (excludeFromSearch.includes(valueId)) return;

            if (!acc[key].some(item => item.value === valueId)) {
              acc[key].push({
                label: (value as Record<string, string>)?.[fieldToSearch.labelField || 'title'] || 'Untitled',
                value: valueId || '',
                isDisplayPriority: (value as Record<string, boolean>)?.displayPriority || false,
              });
            }
          } else if (value) {
            if (excludeFromSearch.includes(value)) return;
            // Handle primitive values
            if (!acc[key].some(item => item.value === value)) {
              acc[key].push({
                label: value,
                value,
                isDisplayPriority: false,
              });
            }
          }
        }
      });
      return acc;
    },
    {}
  ) as EntrySearch.PossibleEntryFilters<T>;
};
