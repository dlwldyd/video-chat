import Modal from 'react-modal';

interface ModalInfo {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    content: JSX.Element,
}

function ModalForm({isOpen, setIsOpen, content}: ModalInfo) {

    const onClose = () => {
        setIsOpen(isOpen => !isOpen);
    }

    return(
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
                },
                content: {
                position: 'absolute',
                top: '350px',
                left: '700px',
                right: '700px',
                bottom: '350px',
                border: '1px solid #ccc',
                background: '#fff',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '4px',
                outline: 'none',
                padding: '20px',
                }
            }}>
            {content}
        </Modal>
    )
}

export default ModalForm;