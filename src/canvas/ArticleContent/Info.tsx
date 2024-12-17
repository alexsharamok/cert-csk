import Image from '@/components/Image';
import { FC } from 'react';

type InfoProps = {
  title?: string;
  description?: string;
  logo?: string;
};

const Info: FC<InfoProps> = ({ title, description, logo }) => (
  <div className="hidden group-hover:block shadow-2xl bg-white p-4 absolute bottom-[30px] w-[400px] rounded-lg">
    {logo && (
      <Image className="aspect-video w-full object-contain" src={logo} alt="source logo" width={500} height={500} />
    )}

    <div className="flex flex-col gap-4">
      <div className="text-black text-center font-bold text-xl">{title}</div>
      <div className="text-black">{description}</div>
    </div>
  </div>
);

export default Info;
