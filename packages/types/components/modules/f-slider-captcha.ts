type ProgressStatus = '' | 'moving' | 'success' | 'error';

interface FSliderCaptchaProps {
  bgImage: string;
  fragmentImage: string;
  token: string;
  y: number;
  initialAngle: number;
};

interface verifiedData {
  token: string;
  offsetX: number;
  finalAngle: number;
  data: string;
  startX: number;
}

export type { ProgressStatus, verifiedData, FSliderCaptchaProps }
