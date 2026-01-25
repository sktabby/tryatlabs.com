import React from "react";
import { useParams } from "react-router-dom";
export default function ToolPage(){ const {slug}=useParams(); return <div style={{padding:24}}><h2>{slug}</h2><p>Placeholder tool page.</p></div>; }
