import React from "react";
import PropTypes from "prop-types";

const Difficulty = ({ level }) => {
  return (
    <div>
      <p className="no-margin text-right">
        <small className="text-muted right">difficulty {level}/10</small>
      </p>
    </div>
  );
};

export default Difficulty;

Difficulty.propTypes = {
  level: PropTypes.number
};
