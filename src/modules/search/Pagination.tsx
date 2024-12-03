import { FC, useCallback, useEffect, useMemo } from 'react';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import { withErrorCallout } from '../../hocs/withErrorCallout';
import Button from '../../components/Button';
import { useUniformEntrySearchContext } from './UniformEntrySearchProvider';

const DEFAULT_PAGE_TO_DISPLAY = 5;

type PaginationProps = {
  pageToDisplay?: string;
};

const Pagination: FC<ComponentProps<PaginationProps>> = ({
  pageToDisplay: pageToDisplayFromCanvas = DEFAULT_PAGE_TO_DISPLAY,
}) => {
  const pageToDisplay = Number(pageToDisplayFromCanvas);
  const { currentPage, totalPages, setCurrentPage } = useUniformEntrySearchContext();

  useEffect(() => {
    setCurrentPage(0);
  }, [pageToDisplay, setCurrentPage]);

  const paginationItems = useMemo(() => {
    const startPaginationIndex = (() => {
      const sideItemsCount = Math.floor(pageToDisplay / 2);
      if (currentPage - sideItemsCount <= 0) {
        return 0;
      } else if (currentPage + sideItemsCount >= totalPages) {
        return totalPages - pageToDisplay;
      } else {
        return currentPage - sideItemsCount;
      }
    })();

    return Array.from(
      { length: pageToDisplay < totalPages ? pageToDisplay : totalPages },
      (_, i) => i + startPaginationIndex
    );
  }, [currentPage, pageToDisplay, totalPages]);

  const moveToNewPage = useCallback(
    (value: number) => () => setCurrentPage(prevState => prevState + value),
    [setCurrentPage]
  );

  if (totalPages < 2) return null;

  return (
    <div className="flex flex-row items-center justify-center gap-2 [&>*]:border-none">
      <Button onClick={moveToNewPage(-1)} disable={!currentPage} copy="<" style="ghost" />
      {paginationItems.map(page => (
        <Button
          key={page}
          disable={page === currentPage}
          onClick={() => setCurrentPage(page)}
          copy={<label className="text-black">{page + 1}</label>}
          style="secondary"
        />
      ))}
      <Button disable={currentPage === totalPages - 1} onClick={moveToNewPage(1)} copy=">" style="ghost" />
    </div>
  );
};

registerUniformComponent({
  type: 'pagination',
  component: withErrorCallout(
    Pagination,
    'Something went wrong. Please use Pagination components only inside the Uniform Entry Search Engine component'
  ),
});

export default Pagination;
