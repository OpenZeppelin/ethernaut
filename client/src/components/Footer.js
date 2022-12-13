import React from "react";
import { loadTranslations } from "../utils/translations";
import { connect } from "react-redux";
import { contractsDeploymentStatus, raiseIssue, deployStatus } from "../utils/contractutil";

export const Footer = (props) => {
    let language = localStorage.getItem("lang");
    const strings = loadTranslations(language);
    const deploymentStatus = contractsDeploymentStatus(props.network.networkId);

    return (deploymentStatus === deployStatus.ALL_DEPLOYED ?
        <footer
            className="deploy-footer"
            dangerouslySetInnerHTML={{ __html: strings.submitGameFooter }}
            onClick={raiseIssue}
        ></footer>
        : (
            deploymentStatus === deployStatus.CORE_DEPLOYED ?
                <footer
                    className="footer"
                    dangerouslySetInnerHTML={{ __html: strings.submitLevelFooter }}
                ></footer>
                :
                <footer
                    className="footer"
                    dangerouslySetInnerHTML={{ __html: strings.footer }}
                ></footer>
        )
    );
};


const mapStateToProps = (state) => {
    return {
        network: state.network,
    };
}


export default connect(mapStateToProps)(Footer);