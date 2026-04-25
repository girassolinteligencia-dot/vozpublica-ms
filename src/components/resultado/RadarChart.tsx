'use client';

import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { TOKENS } from '@/lib/tokens';

interface RadarData {
  atributo: string;
  valor: number;
}

interface RadarChartProps {
  data: RadarData[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke={TOKENS.COLORS.BORDER} opacity={0.2} />
          <PolarAngleAxis 
            dataKey="atributo" 
            tick={{ fill: TOKENS.COLORS.TEXT_MUTED, fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 'auto']} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Avaliação"
            dataKey="valor"
            stroke={TOKENS.COLORS.PRIMARY}
            fill={TOKENS.COLORS.PRIMARY}
            fillOpacity={0.4}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};
