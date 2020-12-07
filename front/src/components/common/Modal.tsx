import React from 'react'

interface Props {
  modalId: string
  title?: string
  footer?: React.ReactNode
}

export const Modal: React.FC<Props> = ({
  modalId,
  title,
  footer,
  children
}) => {
  return (
    <div className="modal fade" id={modalId} aria-labelledby={modalId}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {title && (
              <h4 className="modal-title" id="myModalLabel">
                {title}
              </h4>
            )}
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
