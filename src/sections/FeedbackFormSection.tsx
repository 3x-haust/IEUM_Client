import { useEffect, useRef, useState } from 'react';
import { PrimaryButton } from '@/components';
import * as S from './FeedbackFormSection.styled';

interface FeedbackFormSectionProps {
  onSubmit: (message: string) => Promise<void> | void;
}

function FeedbackFormSection({ onSubmit }: FeedbackFormSectionProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mountedRef = useRef(true);
  const canSubmit = !isSubmitting && message.trim().length >= 2;

  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    void Promise.resolve(onSubmit(message.trim())).finally(() => {
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <S.Wrapper>
      <S.Textarea
        placeholder="학생들을 위한 소중한 의견을 남겨주세요"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isSubmitting}
      />
      <S.BottomCTA>
        <PrimaryButton
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {isSubmitting ? '전송 중...' : '확인'}
        </PrimaryButton>
      </S.BottomCTA>
    </S.Wrapper>
  );
}

export default FeedbackFormSection;
