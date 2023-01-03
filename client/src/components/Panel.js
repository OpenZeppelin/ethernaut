import React from "react";

export default function StatisticPanel({ children, title, show }) {
  if(!show) return <></>;
  return (
    <section className="statisticspanel">
      <h5 className="statisticspanel__header">{title}</h5>
      <div className="statisticspanel__content">{children}</div>
    </section>
  );
}
