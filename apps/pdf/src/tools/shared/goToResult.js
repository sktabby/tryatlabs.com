export function goToResult(navigate, { slug, title, fileName, bytes }) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  navigate("/result", {
    state: {
      slug,
      title,
      fileName,
      blobUrl,
      sizeBytes: blob.size
    }
  });
}
