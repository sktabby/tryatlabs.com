import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { IMAGE_TOOLS } from "../tools/index.jsx";
import NotFound from "./NotFound.jsx";

export default function ToolPage() {
  const { slug } = useParams();

  const tool = useMemo(() => {
    const s = String(slug || "").trim();
    return IMAGE_TOOLS.find((t) => t.key === s) || null;
  }, [slug]);

  if (!tool) return <NotFound />;

  const Component = tool.component;
  return <Component />;
}
