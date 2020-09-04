import React from 'react';

const Participant = function (props) {
  return (
    <div className="participant">
      <div
        className="participant-username"
        style={{borderLeftColor: props.color}}
      >{JSON.parse(props.displayName).displayName}</div>
    </div>
  );
};

export default Participant;
