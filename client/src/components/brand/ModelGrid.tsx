import React from "react"
import EVCard, { type EV } from "../ui/EVCard"
import SectionTitle from "../ui/SectionTitle"

export type ModelGridProps = {
  items: EV[]
  brandKey?: string
  theme?: { sectionBg?: string }
}

export default function ModelGrid({ items, brandKey, theme = {} }: ModelGridProps) {

  const [animate, setAnimate] = React.useState(false)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const filtered = React.useMemo(() => {
    if (!items?.length) return []
    if (!brandKey) return items
    const key = brandKey.toLowerCase()
    const prefix = `${key}-`
    return items.filter((ev) => ev.slug?.toLowerCase().startsWith(prefix))
  }, [items, brandKey])

  if (filtered.length === 0) return null

  const { sectionBg = "bg-transparent" } = theme

  return (
    <>
      <SectionTitle title={`${brandKey}`} label="EV Power"/>
      <section className={`${sectionBg} py-10 sm:py-12`}>
        <div className="mx-auto max-w-[2580px] px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="grid grid-cols-1 gap-6 [1200px]:grid-cols-1 lg:grid-cols-2">
            {filtered.map((ev, idx) => (
                <EVCard key={ev._id} ev={ev} idx={idx} animate={animate} />
            ))}
            </div>
        </div>
      </section>
    </>

  )
}
