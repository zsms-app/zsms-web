import { useState } from "react";
import { SegmentedMessage } from "sms-segments-calculator";

export function MessageInputControl({ value, onChange, onCtrlEnter }) {
  function SmsSegmentHelpText() {
    const v = new SegmentedMessage(value || "");
    const maxBitsInSegment = 1120; // max size of a SMS is 140 octets -> 140 * 8bits = 1120 bits
    return (
      <p className="help">
        <div className="messageSegments">
          {v.segments.map((segment, i) => (
            <progress
              key={i}
              className="progress"
              value={segment.sizeInBits()}
              max={maxBitsInSegment}
            >
              {segment.sizeInBits()}/{maxBitsInSegment}
            </progress>
          ))}
        </div>
        {v.segments.length > 1
          ? `Ce message sera réparti sur ${v.segments.length} segments SMS.`
          : ""}
      </p>
    );
  }

  return (
    <div className="control">
      <textarea
        className="textarea"
        id="message"
        rows="5"
        value={value}
        onChange={onChange}
        onKeyUp={(e) => {
          if (e.ctrlKey && e.keyCode == 13 && onCtrlEnter) {
            onCtrlEnter(e);
          }
        }}
      />
      <SmsSegmentHelpText />
    </div>
  );
}
