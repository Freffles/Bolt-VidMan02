import * as React from "react"
import { cn } from "../../lib/utils"

/**
 * Input component for text entry
 * Should be used with a label for accessibility
 */
const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  id,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  ...props 
}, ref) => {
  // Ensure there's either an id (for label association) or an aria-label
  if (!id && !ariaLabel && process.env.NODE_ENV !== 'production') {
    console.warn('Input component should have either an id (with associated label) or an aria-label for accessibility')
  }

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
