import LeaderTile from "./LeaderTile";
import AliasModal from "./AliasModal";
import { useEffect, useState } from "react";

function LeaderList(props) {
    const { players } = props;
    const [show, setShow] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)

    const showEditModal = () => {
        setShow(true)
    }

    const handleClose = () => { 
        setShow(false)
    }

    useEffect(() => { 
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(address => { 
            setCurrentUser(address[0])
        })
    })

    return (
        <>
            <AliasModal currentUser={currentUser} onClose={handleClose} show={show} />
        <div>
            {players.slice(0,20).map((leader) =>
                <LeaderTile
                    currentUser={currentUser}
                    onAliasEdit={showEditModal}
                    key={leader.player} rank={leader.rank} leader={leader}
                />
            )}
            </div>
        </>
    )
}

export default LeaderList;