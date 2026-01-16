import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Globe, ShieldCheck, Terminal, Layers, Box, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import type { ApiResponse, CodexItem } from '@shared/types';
export function Universe() {
  const [search, setSearch] = useState('');
  const { data: codex } = useQuery({
    queryKey: ['codex'],
    queryFn: async () => {
      const res = await fetch('/api/codex');
      const json = await res.json() as ApiResponse<CodexItem[]>;
      return json.data;
    }
  });
  const filtered = codex?.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );
  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Robust': return <ShieldCheck className="size-4 text-emerald-400" />;
      case 'USB': return <Zap className="size-4 text-orange-400" />;
      case 'VM': return <Box className="size-4 text-blue-400" />;
      case 'Visionary': return <Globe className="size-4 text-purple-400" />;
      default: return <Layers className="size-4 text-slate-400" />;
    }
  };
  return (
    <AppLayout container className="bg-slate-950 text-slate-200">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase">Universe Codex</h1>
            <p className="text-blue-400 font-mono text-xs tracking-widest uppercase">The Infinity Robust Technical Registry</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search features..." 
              className="pl-10 bg-slate-900/50 border-white/10 text-xs focus:ring-blue-500/50"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-dark border-white/10 h-full hover:border-blue-500/30 transition-all group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{item.category}</span>
                    </div>
                    <Badge variant="outline" className={`text-[8px] uppercase ${item.complexity === 'God' ? 'border-orange-500 text-orange-400' : 'border-slate-700 text-slate-400'}`}>
                      {item.complexity}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-white mt-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  {item.cmd && (
                    <div className="bg-black/40 p-2 rounded border border-white/5 flex items-center gap-2">
                      <Terminal className="size-3 text-emerald-400" />
                      <code className="text-[10px] font-mono text-emerald-300/80">{item.cmd}</code>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}