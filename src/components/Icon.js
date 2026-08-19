import React from 'react';

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.8,
  viewBox: '0 0 24 24',
};

const paths = {
  arrowLeft: <path d="M14.5 6 8.5 12l6 6" />,
  arrowRight: <path d="m9.5 6 6 6-6 6" />,
  bolt: <path d="M13 2 4 14h6l-1 8 11-14h-6l-1-6z" />,
  calendar: (
    <>
      <path d="M7 3v4M17 3v4M4 9h16" />
      <path d="M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    </>
  ),
  chart: <path d="M4 17 9 12l4 4 7-9M20 7v6h-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  dumbbell: <path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12M9 8v8M15 8v8" />,
  eye: (
    <>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <path d="M12 9.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z" />
    </>
  ),
  heart: (
    <>
      <path d="M20.2 8.3c0 4.9-8.2 10.2-8.2 10.2S3.8 13.2 3.8 8.3A4.1 4.1 0 0 1 11 5.7a4.1 4.1 0 0 1 7.2 2.6z" />
      <path d="M7.5 12h2.6l1.2-2.3 2.3 5 1.2-2.7h2.7" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" />
      <path d="M5 19 15 9" />
    </>
  ),
  mail: (
    <>
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  map: (
    <>
      <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  person: (
    <>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M4 21a8 8 0 0 1 16 0" />
      <path d="M18 8h3M19.5 6.5v3" />
    </>
  ),
  phone: <path d="M8 4 6 6c-.5.5-.6 1.2-.3 1.8 2.2 4.8 5.7 8.3 10.5 10.5.6.3 1.3.2 1.8-.3l2-2-3.6-3.6-1.9 1.9c-1.9-1-3.7-2.8-4.7-4.7l1.9-1.9L8 4z" />,
  target: (
    <>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
      <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </>
  ),
  timer: (
    <>
      <path d="M9 2h6M12 8v5l3 2" />
      <path d="M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: (
    <>
      <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="m14 6 4 4" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronUp: <path d="m18 15-6-6-6 6" />,
  sort: <path d="M8 9l4-5 4 5M8 15l4 5 4-5" />,
  grid: (
    <>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </>
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  plus: <path d="M12 5v14M5 12h14" />,
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  alert: (
    <>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a1.6 1.6 0 0 0 1.4 2.4h17.6a1.6 1.6 0 0 0 1.4-2.4L13.7 3.9a1.6 1.6 0 0 0-2.8 0z" />
    </>
  ),
  users: (
    <>
      <path d="M17 21a4 4 0 0 0-8 0" />
      <path d="M13 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M21 21a3.5 3.5 0 0 0-3.3-4.9" />
      <path d="M15.7 3.2A4 4 0 0 1 18 11" />
    </>
  ),
  card: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M3 10h18" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" />
      <path d="M6 6h12v14H6z" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  gauge: (
    <>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
      <path d="M12 12 16 8" />
    </>
  ),
  settings: (
    <>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.9-1.4-2-3.4-2.2.7a7.7 7.7 0 0 0-2.6-1.5L14 2.3h-4l-.5 2.6a7.7 7.7 0 0 0-2.6 1.5l-2.2-.7-2 3.4L4.6 10.5a7.6 7.6 0 0 0 0 3L2.7 15l2 3.4 2.2-.7a7.7 7.7 0 0 0 2.6 1.5l.5 2.6h4l.5-2.6a7.7 7.7 0 0 0 2.6-1.5l2.2.7 2-3.4-1.9-1.4z" />
    </>
  ),
  inbox: (
    <>
      <path d="M3 12h5l2 3h4l2-3h5" />
      <path d="M5 5h14l2 7v7H3v-7z" />
    </>
  ),
  image: (
    <>
      <path d="M4 5h16v14H4z" />
      <path d="M4 16l5-5 4 4 3-3 4 4" />
      <path d="M9 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </>
  ),
};

function Icon({ name }) {
  if (name === 'star') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2-4.6-4.4 6.3-.9L12 2.8z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...common}>
      {paths[name] || paths.bolt}
    </svg>
  );
}

export default Icon;
