import React from "react";
import { useParams, Link } from "react-router-dom";
import SeoHead from "../../seo/SeoHead";

export default function Category() {
  const { category } = useParams();
  return (
    <div>
      <SeoHead title={`${category} Tools — TryAtLabs`} path={`/${category}`} />
      <h2>Category: {category}</h2>
      <p>Example tool link:</p>
      <Link to={`/${category}/sample-tool`}>Open sample tool</Link>
    </div>
  );
}
