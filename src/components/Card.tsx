import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'success' | 'warning' | 'error';
    size?: 'small' | 'medium' | 'large';
    showHover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    size = 'medium',
    showHover = true,
    onClick,
}) => {
    const baseClasses = `
    flex relative items-center justify-center
    text-center break-words select-none
    border-2 rounded-lg shadow-md
    transform transition-all
    ${showHover ? 'hover:scale-105 hover:shadow-xl' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

    const sizeClasses = {
        small: 'w-[35vw] md:w-[25vw] lg:w-[12vw] h-[10vh] md:h-[11vh] lg:h-[12vh] p-1 md:p-2 text-sm md:text-base',
        medium: 'w-[40vw] md:w-[30vw] max-w-60 lg:w-[15vw] h-[12vh] md:h-[13vh] lg:h-[14vh] p-1 md:p-2 lg:p-4 text-lg md:text-xl',
        large: 'w-[45vw] md:w-[35vw] lg:w-[18vw] h-[14vh] md:h-[15vh] lg:h-[16vh] p-2 md:p-3 lg:p-5 text-xl md:text-2xl'
    };

    const variantClasses = {
        default: 'bg-blue-50 border-blue-600 shadow-blue-800',
        success: 'bg-green-50 border-green-600 shadow-green-900',
        warning: 'bg-yellow-50 border-yellow-600 shadow-yellow-900',
        error: 'bg-red-50 border-red-600 shadow-red-900'
    };

    const textClasses = `
    leading-none
    md:leading-tight
    lg:leading-normal
  `;

    const finalClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${textClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <div className={finalClasses} onClick={onClick}>
            {children}
        </div>
    );
}; 