import BaselineSpec from "@/app/chapters/chapter-1/plots/baselineSpec";
import PsiGaugeSpec from "@/app/chapters/chapter-1/plots/psiGaugeSpec";

type PlotSpec = {
  data: any[];
  layout?: Record<string, unknown>;
  config?: Record<string, unknown>;
};

type HistogramSpec = (values: number[], feature: string) => PlotSpec;
type GaugeSpec = (psi: number, thresholds: { warn: number; alert: number }) => PlotSpec;

export const histogramSpecs = {
  baseline: BaselineSpec,
} satisfies Record<string, HistogramSpec>;

export type HistogramSpecKey = keyof typeof histogramSpecs;

export const gaugeSpecs = {
  psiGauge: PsiGaugeSpec,
} satisfies Record<string, GaugeSpec>;

export type GaugeSpecKey = keyof typeof gaugeSpecs;
