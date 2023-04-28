import React from "react";
import { formatNumberWithComma } from "../../utils/stringutil";

export default function Statistic({
    heading,
    value = 0
}) {
  return <section className="statisticscomponent">
    <h5 className="statisticscomponent__header">
        {heading}
    </h5>
    <p className="statisticscomponent__content">
        {formatNumberWithComma(value)}
    </p>
  </section>;
}
