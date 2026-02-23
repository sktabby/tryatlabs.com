import React from "react";

import BatchProcessor from "./batch-processor/BatchProcessor.jsx";
import CompressImage from "./compress-image/CompressImage.jsx";
import ConvertImage from "./convert-image/ConvertImage.jsx";
import CropImage from "./crop-image/CropImage.jsx";
import ResizeImage from "./resize-image/ResizeImage.jsx";
import SocialPresets from "./social-presets/SocialPresets.jsx";

const Icon = ({ d }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TOOL_ICONS = {
  batch: <Icon d="M7 7h10M7 12h10M7 17h10M4 5v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" />,
  compress: <Icon d="M8 4h8M9 9h6M10 14h4M11 19h2M6 3h12v18H6V3z" />,
  convert: <Icon d="M7 7h10v10H7V7zM4 10V7a3 3 0 0 1 3-3h3M20 14v3a3 3 0 0 1-3 3h-3" />,
  crop: <Icon d="M6 3v12a3 3 0 0 0 3 3h12M3 6h12a3 3 0 0 1 3 3v12" />,
  resize: <Icon d="M4 9V4h5M20 15v5h-5M4 15v5h5M20 9V4h-5" />,
  social: <Icon d="M7 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 18a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4" />
};

export const IMAGE_TOOLS = [
  {
    key: "batch-processor",
    name: "Batch Processor",
    description: "Process multiple images at once and download outputs.",
    keywords: "batch image processor bulk resize convert compress",
    icon: TOOL_ICONS.batch,
    component: BatchProcessor
  },
  {
    key: "compress-image",
    name: "Compress Image",
    description: "Shrink file size while keeping visuals clean.",
    keywords: "compress image reduce size jpg webp quality",
    icon: TOOL_ICONS.compress,
    component: CompressImage
  },
  {
    key: "convert-image",
    name: "Convert Image",
    description: "Convert PNG/JPG/WebP in seconds, client-side.",
    keywords: "convert image png to jpg jpg to webp webp to png",
    icon: TOOL_ICONS.convert,
    component: ConvertImage
  },
  {
    key: "crop-image",
    name: "Crop Image",
    description: "Crop precisely with simple, reliable controls.",
    keywords: "crop image aspect ratio square portrait",
    icon: TOOL_ICONS.crop,
    component: CropImage
  },
  {
    key: "resize-image",
    name: "Resize Image",
    description: "Resize by pixels or scale while preserving quality.",
    keywords: "resize image pixels scale dimensions",
    icon: TOOL_ICONS.resize,
    component: ResizeImage
  },
  {
    key: "social-presets",
    name: "Social Presets",
    description: "One-click sizes for Instagram, YouTube, and more.",
    keywords: "social presets instagram youtube thumbnail story post",
    icon: TOOL_ICONS.social,
    component: SocialPresets
  }
];
