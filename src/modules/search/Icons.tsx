import { FC, SVGProps } from 'react';
import classNames from 'classnames';

export const IconSearch: FC<SVGProps<SVGSVGElement>> = ({ className = '', ...restProps }) => (
  <svg className={className} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...restProps}>
    <path d="M18.6692 17.1269L12.9424 11.3994C13.8232 10.2429 14.3189 8.75603 14.3189 7.15867C14.3189 3.19367 11.1251 0 7.15997 0C3.19484 0 0 3.19473 0 7.15973C0 11.1247 3.19378 14.3184 7.15891 14.3184C8.75633 14.3184 10.1875 13.8228 11.3997 12.942L17.1275 18.6696C17.3475 18.8895 17.6231 19 17.8989 19C18.1746 19 18.4492 18.8895 18.6702 18.6696C19.1101 18.2287 19.1101 17.5678 18.6692 17.1269ZM7.15997 12.116C4.40605 12.116 2.20355 9.91355 2.20355 7.15973C2.20355 4.4059 4.40605 2.20348 7.15997 2.20348C9.91388 2.20348 12.1164 4.4059 12.1164 7.15973C12.1164 9.91249 9.91285 12.116 7.15997 12.116Z" />
  </svg>
);

export const LoadingIcon: FC<SVGProps<SVGSVGElement>> = ({ className = 'text-white', ...restProps }) => (
  <svg
    className={classNames('-ml-1 mr-3 h-5 w-5 animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...restProps}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
