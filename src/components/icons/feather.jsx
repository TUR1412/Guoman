import React from 'react';

const DEFAULT_SIZE = 18;

const mergeStyle = (base, override) => {
  if (!override) return base;
  return { ...base, ...override };
};

export function FeatherIcon({
  size = DEFAULT_SIZE,
  color = 'currentColor',
  title,
  children,
  style,
  ...rest
}) {
  const ariaProps = title ? { role: 'img' } : { 'aria-hidden': true };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      shapeRendering="geometricPrecision"
      style={mergeStyle(
        {
          color,
          display: 'inline-block',
          verticalAlign: '-0.125em',
          flexShrink: 0,
        },
        style,
      )}
      {...ariaProps}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function FiActivity(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'22 12 18 12 15 21 9 3 6 12 2 12'} />
    </FeatherIcon>
  );
}

export function FiAlertTriangle(props) {
  return (
    <FeatherIcon {...props}>
      <path
        d={
          'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'
        }
      />
      <line x1={'12'} y1={'9'} x2={'12'} y2={'13'} />
      <line x1={'12'} y1={'17'} x2={'12.01'} y2={'17'} />
    </FeatherIcon>
  );
}

export function FiArrowLeft(props) {
  return (
    <FeatherIcon {...props}>
      <line x1={'19'} y1={'12'} x2={'5'} y2={'12'} />
      <polyline points={'12 19 5 12 12 5'} />
    </FeatherIcon>
  );
}

export function FiArrowRight(props) {
  return (
    <FeatherIcon {...props}>
      <line x1={'5'} y1={'12'} x2={'19'} y2={'12'} />
      <polyline points={'12 5 19 12 12 19'} />
    </FeatherIcon>
  );
}

export function FiAward(props) {
  return (
    <FeatherIcon {...props}>
      <circle cx={'12'} cy={'8'} r={'7'} />
      <polyline points={'8.21 13.89 7 23 12 20 17 23 15.79 13.88'} />
    </FeatherIcon>
  );
}

export function FiBell(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'} />
      <path d={'M13.73 21a2 2 0 0 1-3.46 0'} />
    </FeatherIcon>
  );
}

export function FiBookOpen(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'} />
      <path d={'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'} />
    </FeatherIcon>
  );
}

export function FiCalendar(props) {
  return (
    <FeatherIcon {...props}>
      <rect x={'3'} y={'4'} width={'18'} height={'18'} rx={'2'} ry={'2'} />
      <line x1={'16'} y1={'2'} x2={'16'} y2={'6'} />
      <line x1={'8'} y1={'2'} x2={'8'} y2={'6'} />
      <line x1={'3'} y1={'10'} x2={'21'} y2={'10'} />
    </FeatherIcon>
  );
}

export function FiCheck(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'20 6 9 17 4 12'} />
    </FeatherIcon>
  );
}

export function FiCheckCircle(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M22 11.08V12a10 10 0 1 1-5.93-9.14'} />
      <polyline points={'22 4 12 14.01 9 11.01'} />
    </FeatherIcon>
  );
}

export function FiChevronLeft(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'15 18 9 12 15 6'} />
    </FeatherIcon>
  );
}

export function FiChevronRight(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'9 18 15 12 9 6'} />
    </FeatherIcon>
  );
}

export function FiClock(props) {
  return (
    <FeatherIcon {...props}>
      <circle cx={'12'} cy={'12'} r={'10'} />
      <polyline points={'12 6 12 12 16 14'} />
    </FeatherIcon>
  );
}

export function FiCommand(props) {
  return (
    <FeatherIcon {...props}>
      <path
        d={
          'M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z'
        }
      />
    </FeatherIcon>
  );
}

export function FiCompass(props) {
  return (
    <FeatherIcon {...props}>
      <circle cx={'12'} cy={'12'} r={'10'} />
      <polygon points={'16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76'} />
    </FeatherIcon>
  );
}

export function FiCornerDownLeft(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'9 10 4 15 9 20'} />
      <path d={'M20 4v7a4 4 0 0 1-4 4H4'} />
    </FeatherIcon>
  );
}

export function FiDownload(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'} />
      <polyline points={'7 10 12 15 17 10'} />
      <line x1={'12'} y1={'15'} x2={'12'} y2={'3'} />
    </FeatherIcon>
  );
}

export function FiEye(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'} />
      <circle cx={'12'} cy={'12'} r={'3'} />
    </FeatherIcon>
  );
}

export function FiEyeOff(props) {
  return (
    <FeatherIcon {...props}>
      <path
        d={
          'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'
        }
      />
      <line x1={'1'} y1={'1'} x2={'23'} y2={'23'} />
    </FeatherIcon>
  );
}

export function FiFilter(props) {
  return (
    <FeatherIcon {...props}>
      <polygon points={'22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3'} />
    </FeatherIcon>
  );
}

export function FiFilm(props) {
  return (
    <FeatherIcon {...props}>
      <rect x={'2'} y={'2'} width={'20'} height={'20'} rx={'2.18'} ry={'2.18'} />
      <line x1={'7'} y1={'2'} x2={'7'} y2={'22'} />
      <line x1={'17'} y1={'2'} x2={'17'} y2={'22'} />
      <line x1={'2'} y1={'12'} x2={'22'} y2={'12'} />
      <line x1={'2'} y1={'7'} x2={'7'} y2={'7'} />
      <line x1={'2'} y1={'17'} x2={'7'} y2={'17'} />
      <line x1={'17'} y1={'17'} x2={'22'} y2={'17'} />
      <line x1={'17'} y1={'7'} x2={'22'} y2={'7'} />
    </FeatherIcon>
  );
}

export function FiFolder(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'} />
    </FeatherIcon>
  );
}

export function FiGift(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'20 12 20 22 4 22 4 12'} />
      <rect x={'2'} y={'7'} width={'20'} height={'5'} />
      <line x1={'12'} y1={'22'} x2={'12'} y2={'7'} />
      <path d={'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z'} />
      <path d={'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'} />
    </FeatherIcon>
  );
}

export function FiGithub(props) {
  return (
    <FeatherIcon {...props}>
      <path
        d={
          'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'
        }
      />
    </FeatherIcon>
  );
}

export function FiGrid(props) {
  return (
    <FeatherIcon {...props}>
      <rect x={'3'} y={'3'} width={'7'} height={'7'} />
      <rect x={'14'} y={'3'} width={'7'} height={'7'} />
      <rect x={'14'} y={'14'} width={'7'} height={'7'} />
      <rect x={'3'} y={'14'} width={'7'} height={'7'} />
    </FeatherIcon>
  );
}

export function FiHeart(props) {
  return (
    <FeatherIcon {...props}>
      <path
        d={
          'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
        }
      />
    </FeatherIcon>
  );
}

export function FiHelpCircle(props) {
  return (
    <FeatherIcon {...props}>
      <circle cx={'12'} cy={'12'} r={'10'} />
      <path d={'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'} />
      <line x1={'12'} y1={'17'} x2={'12.01'} y2={'17'} />
    </FeatherIcon>
  );
}

export function FiHome(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'} />
      <polyline points={'9 22 9 12 15 12 15 22'} />
    </FeatherIcon>
  );
}

export function FiImage(props) {
  return (
    <FeatherIcon {...props}>
      <rect x={'3'} y={'3'} width={'18'} height={'18'} rx={'2'} ry={'2'} />
      <circle cx={'8.5'} cy={'8.5'} r={'1.5'} />
      <polyline points={'21 15 16 10 5 21'} />
    </FeatherIcon>
  );
}

export function FiInfo(props) {
  return (
    <FeatherIcon {...props}>
      <circle cx={'12'} cy={'12'} r={'10'} />
      <line x1={'12'} y1={'16'} x2={'12'} y2={'12'} />
      <line x1={'12'} y1={'8'} x2={'12.01'} y2={'8'} />
    </FeatherIcon>
  );
}

export function FiInstagram(props) {
  return (
    <FeatherIcon {...props}>
      <rect x={'2'} y={'2'} width={'20'} height={'20'} rx={'5'} ry={'5'} />
      <path d={'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'} />
      <line x1={'17.5'} y1={'6.5'} x2={'17.51'} y2={'6.5'} />
    </FeatherIcon>
  );
}

export function FiLock(props) {
  return (
    <FeatherIcon {...props}>
      <rect x={'3'} y={'11'} width={'18'} height={'11'} rx={'2'} ry={'2'} />
      <path d={'M7 11V7a5 5 0 0 1 10 0v4'} />
    </FeatherIcon>
  );
}

export function FiLogIn(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4'} />
      <polyline points={'10 17 15 12 10 7'} />
      <line x1={'15'} y1={'12'} x2={'3'} y2={'12'} />
    </FeatherIcon>
  );
}

export function FiMail(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'} />
      <polyline points={'22,6 12,13 2,6'} />
    </FeatherIcon>
  );
}

export function FiMenu(props) {
  return (
    <FeatherIcon {...props}>
      <line x1={'3'} y1={'12'} x2={'21'} y2={'12'} />
      <line x1={'3'} y1={'6'} x2={'21'} y2={'6'} />
      <line x1={'3'} y1={'18'} x2={'21'} y2={'18'} />
    </FeatherIcon>
  );
}

export function FiMessageSquare(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'} />
    </FeatherIcon>
  );
}

export function FiMoon(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'} />
    </FeatherIcon>
  );
}

export function FiMove(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'5 9 2 12 5 15'} />
      <polyline points={'9 5 12 2 15 5'} />
      <polyline points={'15 19 12 22 9 19'} />
      <polyline points={'19 9 22 12 19 15'} />
      <line x1={'2'} y1={'12'} x2={'22'} y2={'12'} />
      <line x1={'12'} y1={'2'} x2={'12'} y2={'22'} />
    </FeatherIcon>
  );
}

export function FiPlay(props) {
  return (
    <FeatherIcon {...props}>
      <polygon points={'5 3 19 12 5 21 5 3'} />
    </FeatherIcon>
  );
}

export function FiRefreshCcw(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'1 4 1 10 7 10'} />
      <polyline points={'23 20 23 14 17 14'} />
      <path d={'M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'} />
    </FeatherIcon>
  );
}

export function FiSearch(props) {
  return (
    <FeatherIcon {...props}>
      <circle cx={'11'} cy={'11'} r={'8'} />
      <line x1={'21'} y1={'21'} x2={'16.65'} y2={'16.65'} />
    </FeatherIcon>
  );
}

export function FiShare2(props) {
  return (
    <FeatherIcon {...props}>
      <circle cx={'18'} cy={'5'} r={'3'} />
      <circle cx={'6'} cy={'12'} r={'3'} />
      <circle cx={'18'} cy={'19'} r={'3'} />
      <line x1={'8.59'} y1={'13.51'} x2={'15.42'} y2={'17.49'} />
      <line x1={'15.41'} y1={'6.51'} x2={'8.59'} y2={'10.49'} />
    </FeatherIcon>
  );
}

export function FiShield(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'} />
    </FeatherIcon>
  );
}

export function FiStar(props) {
  return (
    <FeatherIcon {...props}>
      <polygon
        points={
          '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
        }
      />
    </FeatherIcon>
  );
}

export function FiSun(props) {
  return (
    <FeatherIcon {...props}>
      <circle cx={'12'} cy={'12'} r={'5'} />
      <line x1={'12'} y1={'1'} x2={'12'} y2={'3'} />
      <line x1={'12'} y1={'21'} x2={'12'} y2={'23'} />
      <line x1={'4.22'} y1={'4.22'} x2={'5.64'} y2={'5.64'} />
      <line x1={'18.36'} y1={'18.36'} x2={'19.78'} y2={'19.78'} />
      <line x1={'1'} y1={'12'} x2={'3'} y2={'12'} />
      <line x1={'21'} y1={'12'} x2={'23'} y2={'12'} />
      <line x1={'4.22'} y1={'19.78'} x2={'5.64'} y2={'18.36'} />
      <line x1={'18.36'} y1={'5.64'} x2={'19.78'} y2={'4.22'} />
    </FeatherIcon>
  );
}

export function FiTag(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z'} />
      <line x1={'7'} y1={'7'} x2={'7.01'} y2={'7'} />
    </FeatherIcon>
  );
}

export function FiToggleLeft(props) {
  return (
    <FeatherIcon {...props}>
      <rect x={'1'} y={'5'} width={'22'} height={'14'} rx={'7'} ry={'7'} />
      <circle cx={'8'} cy={'12'} r={'3'} />
    </FeatherIcon>
  );
}

export function FiToggleRight(props) {
  return (
    <FeatherIcon {...props}>
      <rect x={'1'} y={'5'} width={'22'} height={'14'} rx={'7'} ry={'7'} />
      <circle cx={'16'} cy={'12'} r={'3'} />
    </FeatherIcon>
  );
}

export function FiTrash2(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'3 6 5 6 21 6'} />
      <path d={'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'} />
      <line x1={'10'} y1={'11'} x2={'10'} y2={'17'} />
      <line x1={'14'} y1={'11'} x2={'14'} y2={'17'} />
    </FeatherIcon>
  );
}

export function FiTrendingUp(props) {
  return (
    <FeatherIcon {...props}>
      <polyline points={'23 6 13.5 15.5 8.5 10.5 1 18'} />
      <polyline points={'17 6 23 6 23 12'} />
    </FeatherIcon>
  );
}

export function FiTwitter(props) {
  return (
    <FeatherIcon {...props}>
      <path
        d={
          'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'
        }
      />
    </FeatherIcon>
  );
}

export function FiUpload(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'} />
      <polyline points={'17 8 12 3 7 8'} />
      <line x1={'12'} y1={'3'} x2={'12'} y2={'15'} />
    </FeatherIcon>
  );
}

export function FiUser(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'} />
      <circle cx={'12'} cy={'7'} r={'4'} />
    </FeatherIcon>
  );
}

export function FiUsers(props) {
  return (
    <FeatherIcon {...props}>
      <path d={'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'} />
      <circle cx={'9'} cy={'7'} r={'4'} />
      <path d={'M23 21v-2a4 4 0 0 0-3-3.87'} />
      <path d={'M16 3.13a4 4 0 0 1 0 7.75'} />
    </FeatherIcon>
  );
}

export function FiWifiOff(props) {
  return (
    <FeatherIcon {...props}>
      <line x1={'1'} y1={'1'} x2={'23'} y2={'23'} />
      <path d={'M16.72 11.06A10.94 10.94 0 0 1 19 12.55'} />
      <path d={'M5 12.55a10.94 10.94 0 0 1 5.17-2.39'} />
      <path d={'M10.71 5.05A16 16 0 0 1 22.58 9'} />
      <path d={'M1.42 9a15.91 15.91 0 0 1 4.7-2.88'} />
      <path d={'M8.53 16.11a6 6 0 0 1 6.95 0'} />
      <line x1={'12'} y1={'20'} x2={'12.01'} y2={'20'} />
    </FeatherIcon>
  );
}

export function FiX(props) {
  return (
    <FeatherIcon {...props}>
      <line x1={'18'} y1={'6'} x2={'6'} y2={'18'} />
      <line x1={'6'} y1={'6'} x2={'18'} y2={'18'} />
    </FeatherIcon>
  );
}

export function FiYoutube(props) {
  return (
    <FeatherIcon {...props}>
      <path
        d={
          'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z'
        }
      />
      <polygon points={'9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02'} />
    </FeatherIcon>
  );
}

export function FiZap(props) {
  return (
    <FeatherIcon {...props}>
      <polygon points={'13 2 3 14 12 14 11 22 21 10 12 10 13 2'} />
    </FeatherIcon>
  );
}
