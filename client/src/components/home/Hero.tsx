import HeroImg from '../../../public/heroCar.png'

export default function HeroStats() {
  return (
    <section className="w-full bg-gradient-to-b from-[#E9E9E9] to-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 sm:pb-16">
        {/* Headline */}
        <div className="relative flex flex-col items-center text-center">

          {/* Hero image */}
          <div className="w-full flex justify-center mt-6 sm:mt-10 lg:-mt-8">
            <img
              src={HeroImg}
              alt="Electric vehicle hero"
              className="w-[min(92vw,980px)] h-auto object-contain"
              loading="eager"
              sizes="(min-width:1024px) 980px, (min-width:640px) 70vw, 92vw"
            />
          </div>
        </div>

        <hr className="border-grey-10/60 my-10 sm:my-12" />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <p className="text-primary font-extrabold leading-none text-[clamp(2.25rem,8vw,5rem)]">14M</p>
            <p className="text-grey-100 text-base sm:text-lg md:text-xl leading-tight">
              Battery Cost <br className="hidden sm:block" /> Reduction
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <p className="text-primary font-extrabold leading-none text-[clamp(2.25rem,8vw,5rem)]">89%</p>
            <p className="text-grey-100 text-base sm:text-lg md:text-xl leading-tight">
              Battery Cost <br className="hidden sm:block" /> Reduction
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <p className="text-primary font-extrabold leading-none text-[clamp(2.25rem,8vw,5rem)]">1.2M</p>
            <p className="text-grey-100 text-base sm:text-lg md:text-xl leading-tight">
              Charging <br className="hidden sm:block" /> infrastructure
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
