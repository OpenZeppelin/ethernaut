import { useState } from "react"

const style = {
    position: 'fixed',
    left: '50vw',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--secondary-color)',
    color: "var(--primary-color)",
    padding: '5px 15px',
    top: '10px',
    borderRadius: '5px',
    fontSize: '15px',
}

export function useToast(time) { 
    const [message, setMessage] = useState("") 
    const [currentPos, setCurrentPos] = useState('-200%');
    
    const currentStyle = {
        ...style,
        transition: 'transform 0.3s ease-in-out',
        transform: `translateX(-50%) translateY(${currentPos})`,
    }

    return {
        Toast: <div style={currentStyle}>{message}</div>,
        toast: (newMessage) => {
            setMessage(newMessage)
            setCurrentPos('25%')
            setTimeout(() => {
                setCurrentPos('-200%')
            } , time*1000 || 1000)
        }
    }
}

