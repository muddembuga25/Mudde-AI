
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Zap, Cpu, BrainCircuit } from 'lucide-react';
import { BenchmarkData } from '../types';

interface BenchmarkChartProps {
  data: BenchmarkData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border border-mudde-cyan p-2 rounded shadow-xl">
        <p className="text-[9px] font-mono font-bold text-white mb-1">{label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} className="text-[8px] font-mono" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BenchmarkChart: React.FC<BenchmarkChartProps> = ({ data }) => {
  return (
    <div className="w-full mt-2 md:mt-4 mb-1">
      <div className="flex items-center justify-between mb-2 px-1 md:px-2 border-b border-gray-800 pb-2">
        <div className="flex items-center gap-1.5 md:gap-2">
           <Trophy className="w-3 h-3 md:w-4 md:h-4 text-mudde-gold" />
           <span className="text-[8px] md:text-[10px] font-bold font-mono text-mudde-gold uppercase tracking-tighter sm:tracking-widest">QUANTUM_BENCHMARK</span>
        </div>
      </div>

      <div className="h-[180px] md:h-[250px] w-full bg-gray-900/20 border border-gray-800 rounded p-1 md:p-2 relative">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="metric" type="category" stroke="#888" fontSize={7} md:fontSize={9} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.03)'}} />
              
              <Bar dataKey="gpt4" name="GPT-4o" fill="#444" barSize={6} radius={[0, 2, 2, 0]} />
              <Bar dataKey="claude3" name="Claude 3.5" fill="#845c1e" barSize={6} radius={[0, 2, 2, 0]} />
              <Bar dataKey="mudde" name="MUDDE-PRIME" fill="#00f0ff" barSize={10} radius={[0, 3, 3, 0]}>
                 {data.map((_, index) => <Cell key={`cell-${index}`} fill="#00f0ff" />)}
              </Bar>
            </BarChart>
         </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-2 mt-2">
         <div className="bg-gray-900/50 p-1.5 rounded border border-gray-800 flex flex-col items-center">
            <Zap className="w-2.5 h-2.5 text-mudde-cyan mb-0.5" />
            <div className="text-[6px] text-gray-500 uppercase">Latency</div>
            <div className="text-[8px] font-bold text-white">0.0ms</div>
         </div>
         <div className="bg-gray-900/50 p-1.5 rounded border border-gray-800 flex flex-col items-center">
            <Cpu className="w-2.5 h-2.5 text-mudde-gold mb-0.5" />
            <div className="text-[6px] text-gray-500 uppercase">Arch</div>
            <div className="text-[8px] font-bold text-white">RECURSIVE</div>
         </div>
         <div className="bg-gray-900/50 p-1.5 rounded border border-gray-800 flex flex-col items-center">
            <BrainCircuit className="w-2.5 h-2.5 text-mudde-purple mb-0.5" />
            <div className="text-[6px] text-gray-500 uppercase">Accuracy</div>
            <div className="text-[8px] font-bold text-white">99.9%</div>
         </div>
      </div>
    </div>
  );
};

export default BenchmarkChart;
