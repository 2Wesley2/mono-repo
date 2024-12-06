import Image from 'next/image';

export default function Logo({
  src = '/images/FaciliteVarejo.png',
  alt = 'Sistema Logo',
  width = 500,
  height = 500,
  priority = false,
  lazyLoad = true,
}) {
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      priority={priority}
      loading={lazyLoad ? 'lazy' : 'eager'}
      style={{
        objectFit: 'contain',
        maxWidth: '100%',
        height: 'auto',
        justifySelf: '',
      }}
    />
  );
}
