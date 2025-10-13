import { useEffect, useRef, useState } from "react";

export default function Alarm({alarmData}) {
  const [isResolved, setResolved] = useState(false);
  const closeRef = useRef();
  const modalRef = useRef();


  const resolveClick = (e) => {
    setResolved(true);
    alarmData.resolve(e.target.getAttribute("status"));
    setTimeout(() => {closeRef.current.click(), setResolved(false)}, 4);
  };

  const rejectClick = () => {
    if(!isResolved){
      alarmData.reject();
    }
  };

  useEffect(() => {
        modalRef.current.addEventListener('hide.bs.modal', rejectClick);
        return () => {
            if(modalRef.current) {
                modalRef.current.removeEventListener('hide.bs.modal', rejectClick)
            }
        };

  }, [alarmData]);

  const btnClasses = ["btn-secondary", "btn-primary", "btn-success", "btn-info"];

  return <div ref={modalRef} className="modal fade" id="alarmModal" tabIndex="-1" aria-labelledby="alarmModal" aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="alarmModal">{alarmData.title}</h1><button onClick={rejectClick} ref={closeRef} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body"> {alarmData.message} </div>

            <div className="modal-footer">
              {typeof alarmData.buttons == 'object' && alarmData.buttons.map((btn, index) =>  <button key={btn.status} status={btn.status} onClick={resolveClick} type="button"  className={"btn " + btnClasses[index]} > {btn.title} 
              
              </button>)}
              
              </div>
        </div>
    </div>
</div>;
}
