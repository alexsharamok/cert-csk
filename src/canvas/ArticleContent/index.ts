import { registerUniformComponent, ComponentProps } from '@uniformdev/canvas-react';
import { Document } from '@contentful/rich-text-types';
import type { Asset } from '@uniformdev/assets';
import { RichTextParamValue } from '@uniformdev/canvas';

import { ArticleContent } from './ArticleContent';

type Article = Types.UniformEntry<{
  title: Types.UniformParameter<string>;
  source: Types.UniformParameter<{
    entry: {
      fields: {
        title: Types.UniformParameter<string>;
        value: Types.UniformParameter<string>;
        description: Types.UniformParameter<string>;
        logo: Types.UniformParameter<Asset>;
      };
    };
  }>;
  content: Types.UniformParameter<RichTextParamValue>;
  externalContent: Types.UniformParameter<Record<string, string> | Document>;
  thumbnail: Types.UniformParameter<Asset>;
  author: Types.UniformParameter<string>;
  tag: Types.UniformParameter<
    {
      entry: {
        fields: {
          title: Types.UniformParameter<string>;
          description: Types.UniformParameter<string>;
          logo: Types.UniformParameter<Asset>;
        };
      };
    }[]
  >;
}>;

export type ArticleContentProps = ComponentProps<{
  title?: string;
  article?: Article;
}>;

registerUniformComponent({
  type: 'articleContent',
  component: ArticleContent,
});

export default ArticleContent;
