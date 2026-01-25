import React from "react";
import { useParams } from "react-router-dom";
import SeoHead from "../../seo/SeoHead";

export default function Tool() {
  const { category, slug } = useParams();
  return (
    <div>
      <SeoHead title={`${slug} — TryAtLabs Tools`} path={`/${category}/${slug}`} />
      <h2>{slug}</h2>
      <p>Category: {category}</p>
      <p>This is the dynamic tool page. Later you’ll load the tool component here.</p>
    </div>
  );
}
