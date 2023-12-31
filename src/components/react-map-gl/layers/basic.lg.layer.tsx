import { Layer } from "react-map-gl";
import {
  MAP_LAYERS,
  MAP_MAX_LG_CIRCLE_SIZE,
  MAP_MIN_LG_CIRCLE_SIZE,
  MAP_SOURCE_ID,
} from "@/config";
import { feature } from "@turf/helpers";
import { IFeature } from "@/ds";
import _ from "lodash";
import { useStore } from "@/store";

export const BasicLgLayer = ({
  features,
  property,
}: {
  features: IFeature[];
  property: string;
}) => {
  const { colors, colIndex, cols } = useStore();

  const isNumeric = !features.find(
    (feature) => typeof feature.properties![property] !== "number"
  );
  const values = features.map((feature) =>
    isNumeric ? feature.properties![property] : 1
  );
  const max = _.max(values);
  console.log("[BasicLgLayer] ", { property, isNumeric, max, values });
  const catName = colIndex.category ? cols[colIndex.category].name : null;
  console.log({ cols, colIndex, catName });

  return (
    <>
      <Layer
        {...{
          id: MAP_LAYERS.basic_lg_circle,
          type: "circle", // ref: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
          source: MAP_SOURCE_ID,
          paint: {
            "circle-color": !catName
              ? colors[0]
              : [
                  "case",
                  ["==", ["get", catName], 1],
                  colors[1],
                  ["==", ["get", catName], 2],
                  colors[2],
                  ["==", ["get", catName], 3],
                  colors[3],
                  colors[0],
                ],
            "circle-opacity": 0.8,
            "circle-radius": [
              "case",
              isNumeric,
              [
                "+",
                MAP_MIN_LG_CIRCLE_SIZE,
                [
                  "*",
                  MAP_MAX_LG_CIRCLE_SIZE - MAP_MIN_LG_CIRCLE_SIZE,
                  ["^", ["/", ["number", ["get", property], 0], max], 3],
                ],
              ],
              MAP_MIN_LG_CIRCLE_SIZE,
            ],
          },
        }}
      />

      <Layer
        {...{
          id: MAP_LAYERS.basic_lg_label,
          type: "symbol", // ref: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol
          source: MAP_SOURCE_ID,
          layout: {
            "text-field": isNumeric
              ? [
                  "number-format",
                  ["get", property],
                  { "max-fraction-digits": 1 }, // 最小保留一位，默认三位
                ]
              : ["get", property],
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 14,
          },
          paint: {
            // 'text-color': [],
          },
        }}
      />
    </>
  );
};
