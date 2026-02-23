import { Link, useNavigate } from "react-router-dom";
import { IMAGE_TOOLS } from "../../tools/index.jsx";

export default function ToolShell({ title, description, children, right = null }) {
  const nav = useNavigate();

  // suggested tools (exclude current by title)
  const suggested = IMAGE_TOOLS.filter((t) => t.name !== title).slice(0, 6);

  return (
    <section className="toolShell">
      <div className="container">
        <div className="toolShell__top">
          <div className="toolShell__head">
            <div className="toolShell__actions">
              <button className="btn btn--ghost" type="button" onClick={() => nav(-1)}>
                ← Back
              </button>
              <Link className="btn btn--ghost" to="/">
                All tools
              </Link>
            </div>

            <h1 className="h1">{title}</h1>
            <p className="lead">{description}</p>
          </div>

          {right ? <div className="toolShell__right">{right}</div> : null}
        </div>

        <div className="toolShell__grid">
          <div className="card card--glass">{children}</div>

          <aside className="toolShell__aside">
            <div className="card card--glass">
              <div className="subttl">More tools</div>
              <div className="toolShell__suggest">
                {suggested.map((t) => (
                  <Link key={t.key} to={`/${t.key}`} className="toolShell__suggestItem">
                    <span className="toolShell__suggestIcon">{t.icon}</span>
                    <span className="toolShell__suggestTxt">
                      <span className="toolShell__suggestTitle">{t.name}</span>
                      <span className="toolShell__suggestDesc">{t.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card card--glass">
              <div className="subttl">Fast & Private</div>
              <p className="muted">Your files stay in your browser. Nothing is uploaded.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
