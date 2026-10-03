import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> & { value: string };

/** Fit existing notes when opened; leave subsequent vertical resizing to the user. */
export function PowerNotesTextarea(props: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const borderHeight = textarea.offsetHeight - textarea.clientHeight;
    textarea.style.height = `${Math.ceil(textarea.scrollHeight + borderHeight)}px`;
  }, []);

  return <textarea {...props} ref={ref} />;
}
