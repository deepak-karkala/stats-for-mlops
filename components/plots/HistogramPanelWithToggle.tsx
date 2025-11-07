"use client";

import { useState } from "react";
import { HistogramPanel } from "./HistogramPanel";
import { ToggleGroup } from "../ui/ToggleGroup";
import { HistogramSpecKey } from "./specRegistry";

interface HistogramPanelWithToggleProps {
  id: string;
  dataUrl: string;
  height?: number;
  specKey?: HistogramSpecKey;
  features?: Array<{ label: string; value: string }>;
  defaultFeature?: string;
}

export const HistogramPanelWithToggle = ({
  id,
  dataUrl,
  height = 360,
  specKey = "baseline",
  features = [
    { label: "trip_distance_km", value: "trip_distance_km" },
    { label: "surge_multiplier", value: "surge_multiplier" },
    { label: "fare_amount", value: "fare_amount" },
  ],
  defaultFeature = "trip_distance_km",
}: HistogramPanelWithToggleProps) => {
  const [selectedFeature, setSelectedFeature] = useState(defaultFeature);

  return (
    <div className="histogram-panel-with-toggle">
      <ToggleGroup
        label="Select feature"
        options={features}
        defaultValue={defaultFeature}
        onChange={setSelectedFeature}
      />
      <HistogramPanel
        id={id}
        dataUrl={dataUrl}
        height={height}
        specKey={specKey}
        selectedFeature={selectedFeature}
      />
    </div>
  );
};

export default HistogramPanelWithToggle;
