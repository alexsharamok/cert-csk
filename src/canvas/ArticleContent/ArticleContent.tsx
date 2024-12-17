import { FC, useMemo, useCallback } from 'react';
import { Document, BLOCKS, NodeData } from '@contentful/rich-text-types';
import { UniformRichTextNode, UniformRichTextNodeProps } from '@uniformdev/canvas-react';
import { documentToHtmlString, Options, Next } from '@contentful/rich-text-html-renderer';
import { ArticleContentProps } from '.';
import Image from '../../components/Image';
import Button from '../../components/Button';
import { getMediaUrl } from '../../utilities';
import Info from './Info';

const calculateMinReadTime = (text: string) => {
  const wordsPerMinute = 200;
  const textLength = text.split(/\s+/).length;
  return Math.ceil(textLength / wordsPerMinute);
};

const extractText = (node: UniformRichTextNodeProps['node']): string => {
  let result = node.text || '';

  if (node.children) {
    for (const child of node.children) {
      result += extractText(child);
    }
  }

  return result as string;
};

const documentToHtmlStringOptions: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: NodeData, next: Next) => `<p class="pb-10 text-lg">${next(node.content)}</p>`,
    [BLOCKS.HEADING_2]: (node: NodeData, next: Next) => `<h2 class="pb-2.5 text-2xl">${next(node.content)}</h2>`,
    [BLOCKS.EMBEDDED_ASSET]: (node: NodeData) => {
      const { url, details, description } = node.data.target.fields.file;
      return `<div class="pb-12 lg:pb-16 max-w-4xl">
                <img src="${url}" 
                     height="${details.image.height}" 
                     width="${details.image.width}" 
                     alt="${description}"/>
              </div>`;
    },
  },
};

const UserIcon = () => (
  <svg
    height="40px"
    width="40px"
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 480 480"
    xmlSpace="preserve"
  >
    <g>
      <g>
        <circle style={{ fill: '#B8BAC0' }} cx="240" cy="240" r="240" />
      </g>
      <g>
        <g>
          <path
            style={{ fill: '#FFFFFF' }}
            d="M240,360.07c-27.944,0-53.297-11.991-72.003-31.372c-0.014,11.615-0.436,28.379-3.516,40.611
                 c2.02,1.235,3.588,3.262,3.894,5.784c3.992,32.484,34.781,56.977,71.625,56.977c36.836,0,67.625-24.496,71.625-56.977
                 c0.31-2.525,1.844-4.549,3.895-5.78c-3.08-12.233-3.503-28.999-3.517-40.615C293.297,348.079,267.944,360.07,240,360.07z"
          />
        </g>
      </g>
      <g>
        <g>
          <path
            style={{ fill: '#D7DBE0' }}
            d="M310.44,330.174c-18.549,18.477-43.242,29.896-70.44,29.896
                 c-27.944,0-53.297-11.991-72.003-31.372c-0.014,11.615-0.436,28.379-3.516,40.611c2.02,1.235,3.588,3.262,3.894,5.784
                 c1.765,14.359,8.778,27.144,19.223,36.954C235.766,405.265,290.437,357.702,310.44,330.174z"
          />
        </g>
      </g>
      <g>
        <g>
          <path
            style={{ fill: '#FFFFFF' }}
            d="M312,160.07H176c-22.055,0-40,17.945-40,40v48c0,61.758,46.656,112,104,112s104-50.242,104-112
                 v-56C344,174.426,329.648,160.07,312,160.07z"
          />
        </g>
      </g>
      <g>
        <g>
          <path
            style={{ fill: '#5C546A' }}
            d="M296,72.07H192c-15.047,0-27.695,10.438-31.102,24.449C133.359,100.02,112,123.598,112,152.07v40
                 c0,20.617,8.752,39.851,24,53.52v-45.52c0-22.055,17.945-40,40-40h136c17.648,0,32,14.355,32,32v53.511
                 c15.251-13.667,24-32.899,24-53.511v-48C368,104.371,335.703,72.07,296,72.07z"
          />
        </g>
      </g>
      <g>
        <path
          style={{ fill: '#5C546A' }}
          d="M61.632,400.544C105.562,449.319,169.191,480,240,480s134.438-30.681,178.368-79.456
               c-7.66-10.356-18.462-18.77-32.352-22.659c-0.32-0.09-0.641-0.16-0.969-0.207l-63.859-9.582c-0.391-0.059-1.227-0.09-1.625-0.09
               c-4.039,0-7.445,3.012-7.938,7.023c-4,32.48-34.789,56.977-71.625,56.977c-36.844,0-67.633-24.492-71.625-56.977
               c-0.5-4.129-4.219-7.234-8.141-7.02c-0.469-0.027-0.93,0.012-1.422,0.086l-63.859,9.582c-0.328,0.047-0.648,0.117-0.969,0.207
               C80.094,381.775,69.292,390.188,61.632,400.544z"
        />
      </g>
    </g>
  </svg>
);

export const ArticleContent: FC<ArticleContentProps> = ({ article }) => {
  const {
    title,
    source,
    sourceTitle,
    sourceDescription,
    sourceLogo,
    content,
    thumbnail,
    externalContent,
    author,
    tag,
  } = useMemo(
    () => ({
      title: article?.fields?.title?.value,
      source: article?.fields?.source?.value?.entry.fields.value?.value,
      sourceTitle: article?.fields?.source?.value?.entry.fields.title?.value,
      sourceDescription: article?.fields?.source?.value?.entry.fields.description?.value,
      sourceLogo: article?.fields?.source?.value?.entry.fields.logo?.value,
      content: article?.fields?.content?.value,
      externalContent: article?.fields?.externalContent?.value || '',
      thumbnail: article?.fields?.thumbnail?.value,
      author: article?.fields?.author?.value,
      tag: article?.fields?.tag?.value?.map(tag => ({
        title: tag.entry.fields.title.value,
        description: tag.entry.fields.description.value,
        logo: tag.entry.fields.logo.value,
      })),
    }),
    [article]
  );

  const thumbnailUrl = useMemo(() => getMediaUrl(thumbnail), [thumbnail]);

  const onClickCopy = useCallback(() => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
  }, []);

  const renderArticleContentBasedOnType = () => {
    switch (source) {
      case 'uniform':
        return <UniformRichTextNode node={content.root} />;
      case 'contentful':
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: documentToHtmlString(externalContent as Document, documentToHtmlStringOptions),
            }}
          />
        );
      case 'kontent.ai':
      case 'contentstack':
      case 'wordpress':
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: externalContent,
            }}
          />
        );
      default:
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: externalContent,
            }}
          />
        );
    }
  };

  const readTime = useMemo(() => {
    switch (source) {
      case 'uniform':
        const fullArticleText = extractText(content.root);
        return calculateMinReadTime(fullArticleText);
      case 'contentful':
        return calculateMinReadTime(documentToHtmlString(externalContent as Document, documentToHtmlStringOptions));
      case 'kontent.ai':
      case 'contentstack':
      case 'wordpress':
        return calculateMinReadTime(externalContent as string);
      default:
        return 0;
    }
  }, [content, externalContent, source]);

  return (
    <div className="text-secondary-content flex flex-col justify-between w-full gap-8 mx-auto lg:flex-nowrap rounded-xl">
      <h1 className="text-center text-2xl uppercase">{title}</h1>
      <div className="flex w-full justify-center">
        <div className="flex items-center gap-1">
          <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#1C274C" stroke-width="1.5" />
            <path
              d="M12 8V12L14.5 14.5"
              stroke="#1C274C"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-xs">{readTime} min read</span>
        </div>
      </div>
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <UserIcon />
            <div className="flex flex-col">
              <span>{author}</span>
              <span className="text-xs text-gray-400">Senior Editor</span>
            </div>
          </div>
          <div>
            <Button style="primary" copy="Copy Link" onClick={onClickCopy} />
          </div>
        </div>
      </div>
      {thumbnailUrl && (
        <div className="relative w-full aspect-video">
          <Image className="object-cover" fill alt={title || 'article logo'} src={thumbnailUrl} />
        </div>
      )}
      <div className="text-xl prose [&>*]:max-w-full max-w-full">{renderArticleContentBasedOnType()}</div>
      <div className="flex gap-2 py-6 border-t w-full">
        {tag &&
          tag.map(tagItem => (
            <div
              key={tagItem.title}
              className="uppercase bg-primary w-max text-primary-content text-xs py-1 px-2 rounded-full relative group cursor-pointer"
            >
              {tagItem.title}
              <Info title={tagItem.title} description={tagItem.description} logo={getMediaUrl(tagItem.logo)} />
            </div>
          ))}
        {source && (
          <div className="uppercase bg-primary w-max text-primary-content text-xs py-1 px-2 rounded-full relative group cursor-pointer">
            {sourceTitle}
            <Info title={sourceTitle} description={sourceDescription} logo={getMediaUrl(sourceLogo)} />
          </div>
        )}
      </div>
    </div>
  );
};
