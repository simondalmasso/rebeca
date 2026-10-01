import type { PublicMedia } from '../../shared/catalog-contract';
import { apiBase } from '../lib/api';

export const mediaUrl=(key:string)=>`${apiBase()}/media/${key.split('/').map(encodeURIComponent).join('/')}`;

export function ProductImage({media,alt,className='',priority=false}:{media?:PublicMedia|null;alt:string;className?:string;priority?:boolean}){
  if(!media) return <div className={`product-image placeholder ${className}`} role="img" aria-label={alt}><span>REBECA</span></div>;
  const small=media.smallKey?mediaUrl(media.smallKey):mediaUrl(media.originalKey);
  const large=media.largeKey?mediaUrl(media.largeKey):mediaUrl(media.originalKey);
  return <img
    className={`product-image ${className}`}
    src={priority?large:small}
    srcSet={`${small} 720w, ${large} 1440w`}
    sizes={priority?'(max-width:767px) 80vw, 55vw':'(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw'}
    width={media.width??800}
    height={media.height??1000}
    alt={media.altText||alt}
    loading={priority?'eager':'lazy'}
    fetchPriority={priority?'high':'auto'}
    decoding="async"
  />;
}
