import { useState } from "react";

const Tooltip = (props) => { 

    const { content } = props;

    const [isVisible, setIsVisible] = useState(false)

    const handleMouseEnter = () => { 
        setIsVisible(true)
    }

    const handleMouseLeave = () => { 
        setIsVisible(false)
    }
    

    const style = {
        position: "absolute",
        bottom: 20,
        visibility: isVisible?"visible":"hidden"
    }

    const parentStyle = {
        position:"relative"
    }

    return (
        <div style={parentStyle}>
            <div className='tooltip-container' style={style}>{content}</div>
            <div
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
            >{props.children}</div>
        </div>
    )
}

export default Tooltip;