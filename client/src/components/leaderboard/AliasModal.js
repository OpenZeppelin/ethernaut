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
                    <div onClick={onClose} className='leaderboard-close-button'>
                        <i className="fa-sharp fa-solid fa-xmark"></i>
                    </div>
                    <h3>Leaderboard alias submission</h3>
                    <HubspotForm
                        portalId="7795250"
                        formId="5c2762b1-ad80-4a47-9ef5-91f98d9e9419"
                        region="na1"
                        currentUser={currentUser}
                    />
                </div>
            </div>
        )
    )
}