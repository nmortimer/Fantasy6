import { ReactNode, useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props){
  useEffect(()=>{
    function onKey(e: KeyboardEvent){ if(e.key === 'Escape') onClose(); }
    if(open) window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if(!open) return null;
  return (
    <div className="modalBack" onClick={onClose}>
      <div className="modalCard" onClick={e=>e.stopPropagation()}>
        <div className="modalHead">
          <strong>{title}</strong>
          <button className="ghost" onClick={onClose}>Close</button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
