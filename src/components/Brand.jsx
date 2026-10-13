import {logoDataUrl as logoUrl} from '../assets/brand-data';

export default function Brand({ compact = false }) {
  return (
    <a href="#" aria-label="Vela studio" className="vela-brand flex shrink-0 items-center gap-2.5 text-white no-underline">
      <span className="flex size-9 items-center justify-center rounded-[10px] bg-ivory p-1.5 shadow-sm max-[390px]:size-8">
        <img src={logoUrl} alt="" width="28" height="28" className="block size-full object-contain" draggable="false" />
      </span>
      {!compact && <span className="flex items-center gap-3"><span className="text-[31px] font-medium leading-none tracking-[-1.5px] max-sm:text-[27px]">vela</span><span className="hidden text-[8px] tracking-[0.25em] text-stone-400 xl:inline">STUDIO</span></span>}
    </a>
  );
}
