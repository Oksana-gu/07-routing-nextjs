'use client';

import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  onClose?: () => void;
};

export default function Modal({ children }: Props) {
  const router = useRouter();

  const handleBackdropClick = () => {
    router.back();
  };

  const stopPropagation = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleBackdropClick}>
      <div onClick={stopPropagation}>
        {children}
      </div>
    </div>
  );
}