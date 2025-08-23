import { memo } from 'react'

export default memo(function Spinner() {
  return (
    <div className="flex items-center h-20 justify-center">
      <div
        className="
          w-16 h-16
          border-8 border-gray-200
          border-t-8 border-t-secondary
          rounded-full
          animate-spin
        "
      />
    </div>
  )
})
