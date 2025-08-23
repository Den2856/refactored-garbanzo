/**
 * VersatilePower Component
 * 
 * Props:
 * - bgColor: Background color for the label span
 * - textColor: Text color for the label span
 * - label: Content for the label span
 * - title: Main heading content
 * - className: Additional wrapper classes
 */
export default function SectionTitle({
  bgColor = 'bg-azul',
  textColor = 'text-primary',
  headingColor = 'text-primary',
  label = 'Versatile Power',
  title = 'Discover Our Multi-functional chargers',
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center gap-8 mb-[60px] ${className}`}>
      <div className="text-center w-fit">
        <span className={`${bgColor} ${textColor} text-[18px] uppercase px-[10px] py-[20px]`}>
          {label}
        </span>
      </div>

      <h2 className={`${headingColor} text-5xl lg:text-6xl font-semibold text-center`}>
        {title}
      </h2>
    </div>
  );
}