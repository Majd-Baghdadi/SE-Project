import React from 'react';

const EditText = ({
  // Optional parameters (no defaults)
  placeholder,
  text_font_size,
  text_font_family,
  text_font_weight,
  text_line_height,
  text_text_align,
  text_color,
  layout_gap,
  layout_width,
  padding,
  position,
  margin,
  
  // Standard React props
  variant = 'default',
  size = 'medium',
  type = "text",
  value,
  onChange,
  disabled = false,
  className,
  ...props
}) => {
  // Base classes
  const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant classes
  const variantClasses = {
    default: 'border border-gray-300 hover:border-gray-400',
    filled: 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
    outline: 'border-2 border-green-500 bg-transparent',
  };
  
  // Size classes
  const sizeClasses = {
    small: 'text-sm px-3 py-2',
    medium: 'text-base px-4 py-3',
    large: 'text-lg px-5 py-4',
  };

  // Safe validation for optional parameters
  const hasValidFontSize = text_font_size && typeof text_font_size === 'string' && text_font_size?.trim() !== '';
  const hasValidFontFamily = text_font_family && typeof text_font_family === 'string' && text_font_family?.trim() !== '';
  const hasValidFontWeight = text_font_weight && typeof text_font_weight === 'string' && text_font_weight?.trim() !== '';
  const hasValidLineHeight = text_line_height && typeof text_line_height === 'string' && text_line_height?.trim() !== '';
  const hasValidTextAlign = text_text_align && typeof text_text_align === 'string' && text_text_align?.trim() !== '';
  const hasValidTextColor = text_color && typeof text_color === 'string' && text_color?.trim() !== '';
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== '';
  const hasValidMargin = margin && typeof margin === 'string' && margin?.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== '';
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap?.trim() !== '';

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidMargin ? `m-[${margin}]` : '',
    hasValidPosition ? position : '',
    hasValidGap ? `gap-[${layout_gap}]` : '',
  ]?.filter(Boolean)?.join(' ');

  // Build inline styles for optional parameters
  const inputStyles = {};
  if (hasValidFontSize) inputStyles.fontSize = `${text_font_size}px`;
  if (hasValidFontFamily) inputStyles.fontFamily = text_font_family;
  if (hasValidFontWeight) inputStyles.fontWeight = text_font_weight;
  if (hasValidLineHeight) inputStyles.lineHeight = text_line_height;
  if (hasValidTextAlign) inputStyles.textAlign = text_text_align;
  if (hasValidTextColor) inputStyles.color = text_color;

  const combinedClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.medium,
    optionalClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={inputStyles}
      className={combinedClasses}
      aria-disabled={disabled}
      {...props}
    />
  );
};

export default EditText;