/* eslint-disable */
// @ts-nocheck
import { FC } from 'react';
import classNames from 'classnames';
import { getTextClass } from '@/utilities/styling';
import { UniformText, UniformSlot } from '@uniformdev/canvas-react';
import { VideoPlayerProps } from '.';

export const VideoPlayer: FC<VideoPlayerProps> = ({
  title,
  description,
  source,
  id,
}) => (
    <div className={classNames('hero min-h-[500px] relative', 'text-secondary-content')}>
      <div className={classNames('hero-content text-center p-0')}>
        <div className={classNames('flex flex-col mx-1 md:mx-10')}>
          <h1 className={classNames('font-bold', getTextClass('h5'))}>
            <UniformText parameterId='title' />
          </h1>
          <div className={classNames('py-6')}>
            <UniformText parameterId='description' />
          </div>
          <div className='border-dashed border-4 border-gray-300 p-5 text-gray-300'>
          {source === 'YouTube' &&
            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${id}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          }
          {source === 'Loom' &&
            <iframe width="640" height="360" src={`https://www.loom.com/embed/${id}`} frameborder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
          }
          {!source && 
            <div className=' text-gray-300'>Select a video source</div>
          }
          </div>
          <UniformSlot name="related" />
        </div>
      </div>
    </div>
  );
