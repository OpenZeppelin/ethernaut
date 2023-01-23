import { useRef, useEffect } from "react"
import HubspotForm from "./Hubspot";

export default function AliasModal(props) { 
    const { show, onClose, currentUser } = props;
    const modalEl = useRef(null);

    useEffect(() => {
        const handler = (event) => {
            if (!modalEl.current) {
                return;
            }
            if (!modalEl.current.contains(event.target)) {
                onClose(false);
            }
        };
        document.addEventListener("click", handler, true);
        return () => {
            document.removeEventListener("click", handler);
        };
    },[onClose])

    return (
        show && (
            <div className='leaderboard-alias-modal'>
                <div ref={modalEl} className="leaderboard-modal-body">
                    <h3>Leaderboard alias submission</h3>
                    <HubspotForm
                        portalId="23757576"
                        formId="cfcce456-f7de-4449-a871-dacd139bddf7"
                        region="na1"
                        currentUser={currentUser}
                    />
                </div>
            </div>
        )
    )
}