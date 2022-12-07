import React from "react";
import { loadTranslations } from "../utils/translations";
import { connect } from "react-redux";
import { allNewContractsDeployed, raiseIssue } from "../utils/contractutil";


export const Footer = (props) => {
    let language = localStorage.getItem("lang");
    const strings = loadTranslations(language);

    return (allNewContractsDeployed(props.network.networkId) ?
        <footer
            className="deploy-footer"
            dangerouslySetInnerHTML={{ __html: strings.submitGameFooter }}
            onClick={raiseIssue}
        ></footer>
        :
        <footer
            className="footer"
            dangerouslySetInnerHTML={{ __html: strings.footer }}
        ></footer>
    );
};


const mapStateToProps = (state) => {
    return {
        network: state.network,
    };
}


export default connect(mapStateToProps)(Footer);