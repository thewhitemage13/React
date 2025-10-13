import { useEffect, useRef, useState } from "react";

export default function Alarm({ alarmData }) {
  const [isResolved, setResolved] = useState(false);
  const closeRef = useRef(null);
  const modalRef = useRef(null);

  const baseBtnClasses = ["btn-secondary", "btn-primary", "btn-success", "btn-info"];
  const defaultStatusStyles = {
    ok: "btn-success",
    yes: "btn-success",
    success: "btn-success",
    info: "btn-info",
    warn: "btn-warning",
    warning: "btn-warning",
    danger: "btn-danger",
    error: "btn-danger",
    cancel: "btn-secondary",
    close: "btn-secondary",
    primary: "btn-primary",
  };
  const statusStyles = { ...defaultStatusStyles, ...(alarmData?.statusStyles || {}) };
  const getBtnClass = (status, index) =>
    statusStyles[status] || baseBtnClasses[index % baseBtnClasses.length];

  const resolveClick = (status) => {
    if (alarmData?.resolve) {
      setResolved(true);
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      alarmData.resolve(status);
      setTimeout(() => {
        closeRef.current?.click();
        setResolved(false);
      }, 0);
    }
  };

  const rejectClick = () => {
    if (!isResolved && typeof alarmData?.reject === "function") {
      alarmData.reject();
    }
  };

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    el.addEventListener("hide.bs.modal", rejectClick);
    return () => el.removeEventListener("hide.bs.modal", rejectClick);
  }, []);

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="alarmModal"
      tabIndex="-1"
      aria-labelledby="alarmModal"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="alarmModal">
              {alarmData?.title ?? ""}
            </h1>
            <button
              onClick={rejectClick}
              ref={closeRef}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">{alarmData?.message ?? ""}</div>

          <div className="modal-footer">
            {Array.isArray(alarmData?.buttons) &&
              alarmData.buttons.map((btn, index) => (
                <button
                  key={btn.status ?? index}
                  type="button"
                  className={`btn ${getBtnClass(btn.status, index)}`}
                  onClick={() => resolveClick(btn.status)}
                >
                  {btn.title}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
