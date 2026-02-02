import React from "react";

export default function ToolShell({ title, subtitle, children, right }) {
  return (
    <div className="toolShell">
      <div className="toolShellHead">
        <div>
          {title ? <div className="toolShellTitle">{title}</div> : null}
          {subtitle ? <div className="toolShellSub">{subtitle}</div> : null}
        </div>
        {right ? <div className="toolShellRight">{right}</div> : null}
      </div>
      <div className="toolShellBody">{children}</div>
    </div>
  );
}
