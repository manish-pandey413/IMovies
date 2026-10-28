import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative grid h-[580px] grid-cols-[48%_52%] bg-[#eeece6] px-[8.3%] pt-[72px] pb-[48px] max-md:h-[530px] max-md:px-[6%] max-sm:flex max-sm:min-h-[660px] max-sm:flex-col max-sm:px-[6%] max-sm:pt-[68px] max-sm:pb-[61px]">
      <div className="z-1 self-center pb-[22px] max-sm:pb-[25px]">
        <div className="flex items-center gap-2.5 text-[9px] font-bold tracking-[1.55px] text-[#8c8a83]">
          <span className="h-px w-[22px] bg-accent" /> YOUR SEAT IS WAITING
        </div>
        <h1 className="my-6 font-display text-[66px] font-semibold leading-[1.06] tracking-[-2.3px] max-md:text-[55px] max-sm:mt-[19px] max-sm:mb-[14px] max-sm:text-[56px]">
          Good stories
          <br />
          stay with <em className="text-accent">you.</em>
        </h1>
        <p className="text-sm leading-[1.8] text-[#73716b] max-sm:text-xs">
          The latest films lighting up the big screen.
          <br className="max-sm:hidden" /> Find a show near you and make it a
          movie night.
        </p>
        <a
          className="mt-[22px] inline-flex items-center gap-5 bg-ink px-5 py-3.5 text-[11px] text-white no-underline transition hover:bg-accent max-sm:mt-3"
          href="#movies"
        >
          Explore what’s on <ArrowDown size={15} />
        </a>
      </div>
      <div
        className="relative ml-4 h-[400px] self-center max-md:ml-0 max-md:h-[360px] max-sm:mt-0 max-sm:ml-3 max-sm:h-[270px] max-sm:w-[calc(100%-12px)] max-sm:self-stretch"
        aria-label="Cinema seats ready for movie night"
      >
        <div className="absolute inset-0 bottom-3 left-9 bg-cover bg-center [background-image:url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=88')] max-sm:left-0" />
        <div className="absolute inset-0 bottom-3 left-9 bg-gradient-to-r from-black/10 via-transparent to-transparent max-sm:left-0" />
        <div className="absolute bottom-11 left-0 flex items-center gap-3 bg-[#fbfaf7] px-5 py-4 shadow-lg max-sm:bottom-[30px] max-sm:left-[-12px] max-sm:px-3 max-sm:py-3">
          <span className="grid size-[34px] place-items-center bg-[#f3e9e3] text-accent">
            <Sparkles size={16} />
          </span>
          <span>
            <b className="block text-[11px]">A good night out</b>
            <small className="mt-1 block text-[10px] text-[#99968e]">
              starts right here
            </small>
          </span>
          <ArrowUpRight className="ml-5 text-[#999]" size={16} />
        </div>
        <div className="absolute right-0 bottom-0 flex items-center gap-2 text-[8px] tracking-[1.15px] text-[#8b8981] max-sm:bottom-0">
          <b className="text-[11px] text-ink">01</b>
          <i className="h-px w-[27px] bg-accent" /> THE CINEMA, REIMAGINED
        </div>
      </div>
      <div className="absolute right-[8.3%] bottom-0 left-[8.3%] flex h-10 items-center justify-between border-t border-[#dcd9d1] text-[8px] tracking-[1px] text-[#96938b] max-md:right-[6%] max-md:left-[6%] max-sm:right-[6%] max-sm:left-[6%] max-sm:h-[37px] max-sm:text-[7px]">
        <span>CURATED FOR THE CURIOUS</span>
        <span className="flex items-center gap-2">
          SCROLL TO DISCOVER <ArrowDown size={13} />
        </span>
        <span className="max-sm:hidden">EST. FOR MOVIE LOVERS</span>
      </div>
    </section>
  );
}
