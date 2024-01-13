import React from "react";

interface PriceLegendProps {
  getColor: (price: number) => string;
}

const PriceLegend: React.FC<PriceLegendProps> = ({ getColor }) => {
  return (
    <div className="bg-white p-4 m-2 border rounded-xl shadow-md leaflet-control leaflet-bar leaflet-top leaflet-right">
      <h4 className="text-lg font-semibold mb-2">Price per Night</h4>
      <div className="flex items-center mb-1">
        <div
          className="w-5 h-5 mr-2"
          style={{ background: getColor(1001) }}
        ></div>
        <div>Above €1000</div>
      </div>
      <div className="flex items-center mb-1">
        <div
          className="w-5 h-5 mr-2"
          style={{ background: getColor(501) }}
        ></div>
        <div>€501 - €1000</div>
      </div>
      <div className="flex items-center mb-1">
        <div
          className="w-5 h-5 mr-2"
          style={{ background: getColor(101) }}
        ></div>
        <div>€101 - €500</div>
      </div>
      <div className="flex items-center mb-1">
        <div
          className="w-5 h-5 mr-2"
          style={{ background: getColor(51) }}
        ></div>
        <div>€51 - €100</div>
      </div>
      <div className="flex items-center">
        <div className="w-5 h-5 mr-2" style={{ background: getColor(0) }}></div>
        <div>Below €51</div>
      </div>
    </div>
  );
};

export default PriceLegend;
