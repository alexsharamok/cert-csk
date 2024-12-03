import { registerUniformComponent, UniformSlot } from '@uniformdev/canvas-react';
import EmptyPlaceholder from '../../components/EmptyPlaceholder';
import UniformEntrySearchContextProvider from './UniformEntrySearchProvider';

registerUniformComponent({
  type: 'uniformEntrySearchEngine',
  component: props => (
    <UniformEntrySearchContextProvider {...props}>
      <UniformSlot name="content" emptyPlaceholder={<EmptyPlaceholder />} />
    </UniformEntrySearchContextProvider>
  ),
});
