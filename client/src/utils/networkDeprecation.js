import * as constants from '../constants';

export function networkOnDeprecationOrDeprecated(id) {
    const onDeprecationOrDeprecatedNetworkIds = Object.keys(constants.NETWORKS_DEPRECATION)
        .map(network => Number(constants.NETWORKS_DEPRECATION[network].id));
    return onDeprecationOrDeprecatedNetworkIds.includes(Number(id));
  }

export function isDeprecatedNetwork(id) {
    const deprecatedNetworksIds = Object.keys(constants.NETWORKS_DEPRECATION)
        .filter(network => constants.NETWORKS_DEPRECATION[network].status === "deprecated")
        .map(network => Number(constants.NETWORKS_DEPRECATION[network].id));
    return deprecatedNetworksIds.includes(Number(id));
}

export function deprecationStatus(id) {
    const network = Object.keys(constants.NETWORKS_DEPRECATION)
        .filter(network => constants.NETWORKS_DEPRECATION[network].id === id)[0];
    return constants.NETWORKS_DEPRECATION[network].status;
}

export function deprecationDate(id) {
    const network = Object.keys(constants.NETWORKS_DEPRECATION)
    .filter(network => constants.NETWORKS_DEPRECATION[network].id === id)[0];
    return constants.NETWORKS_DEPRECATION[network].date;
}
