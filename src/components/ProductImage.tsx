import type { PublicMedia } from '../../shared/catalog-contract';
import { apiBase } from '../lib/api';

export const mediaUrl=(key:string)=>`${apiBase()}/media/${key.split('/').map(encodeURIComponent).join('/')}`;

export function ProductImage({media,alt,className='',priority=false}:{media?:PublicMedia|null;alt:string;className?:string;priority?:boolean}){
  if(!media) return <div className={`product-image placeholder ${className}`} role="img" aria-label={alt}><span>REBECA</span></div>;

  const small=media.smallKey?mediaUrl(media.smallKey):mediaUrl(media.originalKey);
  const large=media.largeKey?mediaUrl(media.largeKey):mediaUrl(media.originalKey);

  if(priority){
    return <img
      className={`product-image ${className}`}
      src={large}
      width={media.width??1440}
      height={media.height??1800}
      alt={media.altText||alt}
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />;
  }

  return <img
    className={`product-image ${className}`}
    src={small}
    srcSet={`${small} 720w, ${large} 1440w`}
    sizes="(max-width:640px) 76vw,(max-width:1024px) 42vw,25vw"
    width={media.width??800}
    height={media.height??1000}
    alt={media.altText||alt}
    loading="lazy"
    fetchPriority="auto"
    decoding="async"
  />;
}
