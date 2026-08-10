---
title: "Calculated Soot vs Measured Soot: What DPF Scan-Tool Values Really Mean"
slug: "calculated-soot-versus-measured-soot"
date: 2026-01-12
category: DPF
excerpt: "Both calculated and measured DPF soot values are ECU estimates, not direct measurements. Here is what each one means and how to read them together."
coverImage: "/blog/calculated-soot-versus-measured-soot/cover.jpg"
coverAlt: "Auto-Cleanse two orange-arc dial gauges labelled MODELLED and PRESSURE, split by a not-equals sign, above a caption reading two estimates, one unknown"
author: "Auto-Cleanse"
relatedServices: ["/dpf-diagnostics-devon", "/dpf-cleaning-devon", "/blocked-dpf-cleaning-devon"]
draft: false
---

Many diagnostic tools display two soot values for a DPF, often labelled calculated (or modelled) soot and measured (or pressure-derived) soot. The wording makes one sound like a theoretical estimate and the other like a direct reading. In practice, both are normally ECU estimates, built from different models and different inputs.

Neither figure is a weight of soot taken directly out of the filter. Knowing what each value is actually built from - and where each one can mislead - is what separates a genuine [DPF diagnostic check](/dpf-diagnostics-devon) from picking whichever number looks more reassuring.

> "Measured soot" does not usually mean that a sensor has directly measured the mass of soot inside the filter.

## What the two values represent

The ECU cannot normally weigh the soot trapped inside the DPF while the vehicle is running, so it estimates the loading through calibrated models instead. The exact strategy, and the labels the scan tool shows, vary by manufacturer, engine and software version.

### Calculated or modelled soot

This value comes from a running soot mass balance. The model estimates soot entering the filter and subtracts the soot expected to have been oxidised through passive or active regeneration. Its accuracy depends on the calibration and the validity of the engine inputs feeding it, and both are application-specific.

### Measured or pressure-derived soot

This value comes from filter resistance rather than a direct reading. It uses the differential pressure across the filter, normally interpreted alongside exhaust flow, temperature and calibrated filter characteristics - it is not a raw pressure reading converted straight into grams. Flow, temperature, sensor condition and filter characteristics can all pull it away from the true loading.

## Why the readings can disagree

The two estimates do not have to match at every moment. Their response can differ with operating conditions, and each model has its own limitations. A persistent or extreme disagreement deserves investigation, but it does not identify the failed component by itself.

1. **Low-flow operation.** Differential-pressure-based estimation can be less informative when exhaust flow is low, because the pressure signal is smaller and more sensitive to offset and noise.
2. **Pressure-signal problems.** Sensor offset, damaged or restricted pressure pipes, leaks, condensation or an incorrect adaptation can all distort the pressure-derived estimate. Checks must follow the manufacturer procedure.
3. **Filter characteristics have changed.** Ash, contamination, substrate damage or a non-standard filter can change the flow resistance of a [blocked DPF](/blocked-dpf-cleaning-devon) in ways that do not match the original calibration.
4. **The model inputs are inaccurate.** Airflow, fuelling, temperature and regeneration calculations differ by system, and an input fault can affect a model without making the displayed soot value itself the root cause.

> **Common misdiagnosis:** "Measured soot is low, so the DPF must be clear." A low pressure-derived estimate is not proof of a clean, intact filter. The raw pressure signal, test conditions, pressure pipes, sensor plausibility, ash information and filter condition all still need to support that conclusion.

## A safer diagnostic sequence

1. **Identify the exact application.** Confirm the engine, ECU software and the manufacturer's definition of each data parameter - scan-tool wording is not standardised across every vehicle.
2. **Check pressure plausibility.** Record the differential-pressure value with the engine off where the procedure requires it, then at idle and at the specified raised-speed or loaded test point, against the correct OEM limits.
3. **Review the supporting data.** Compare both soot estimates with ash information, exhaust temperatures, airflow, regeneration history, distance since regeneration and any relevant DTCs.
4. **Inspect the measurement path.** Check the sensor, electrical supply, pressure pipes and connections before treating an implausible soot value as a filter fault.
5. **Confirm the filter condition.** When the data remains contradictory, [test the filter and system](/dpf-cleaning-devon) rather than choosing whichever displayed soot value looks most believable.

## The takeaway

Use the two soot values as cross-checks, not as standalone verdicts. The strongest diagnosis comes from trends, raw pressure data, operating conditions and manufacturer-specific test information - not from a single figure on a scan tool.

## Sources

- [Bosch Mobility - Differential Pressure Sensor](https://www.bosch-mobility.com/en/solutions/sensors/differential-pressure-sensor/)
- [SAE 2021-26-0183 - Model-Based DPF Soot Estimation](https://saemobilus.sae.org/papers/a-model-based-approach-dpf-soot-estimation-validation-bsvi-commercial-vehicles-context-indian-driving-cycles-2021-26-0183)
- [IFAC 2018 - Pressure-Based Soot Loading Estimation](https://www.sciencedirect.com/science/article/pii/S2405896318325382)
- [IFAC 2018 - Mass-Balance Soot Load Model](https://www.sciencedirect.com/science/article/pii/S2405896318325370)
- [Energies 2018 - Soot Estimation Using Pressure, Flow and Temperature](https://www.mdpi.com/1996-1073/11/2/472)

*General technical guidance only. Manufacturer-specific workshop information, parameter definitions, test conditions and specifications take precedence.*
