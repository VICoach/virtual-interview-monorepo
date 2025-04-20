import Image from 'next/image';
import { UI_CONSTANTS } from '@/constants/interview';

interface InterviewIconProps {
  iconPath: string;
  alt: string;
  size?: {
    width: number;
    height: number;
  };
}

export default function InterviewIcon({ 
  iconPath, 
  alt,
  size = UI_CONSTANTS.ICON_SIZE
}: InterviewIconProps) {
  return (
    <div 
      className="w-20 h-20 rounded-full flex items-center justify-center"
      
    >
      <Image 
        src={iconPath} 
        alt={alt} 
        width={size.width} 
        height={size.height}
        className="object-contain"
      />
    </div>
  );
}