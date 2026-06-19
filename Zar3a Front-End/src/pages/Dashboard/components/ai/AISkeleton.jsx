import React from 'react';
import { motion } from 'framer-motion';

const AISkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col gap-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 bg-surface-card dark:bg-slate-800 rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-surface-card dark:bg-slate-800 rounded-lg w-96"></div>
        </div>
        <div className="h-10 bg-surface-card dark:bg-slate-800 rounded-xl w-32"></div>
      </div>

      {/* Executive Summary Skeleton */}
      <div className="h-32 bg-surface-card dark:bg-slate-800 rounded-3xl mt-4"></div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-surface-card dark:bg-slate-800 rounded-2xl"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Health Gauge Skeleton */}
        <div className="lg:col-span-1 bg-surface-card dark:bg-slate-800 rounded-2xl h-[300px] border border-gray-100 dark:border-slate-700 p-6 flex flex-col items-center justify-center">
          <div className="w-40 h-40 rounded-full border-8 border-gray-200 dark:border-slate-700 flex items-center justify-center">
            <div className="w-20 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
          <div className="w-32 h-6 bg-gray-200 dark:bg-slate-700 rounded-lg mt-6"></div>
        </div>

        {/* Recommendations List Skeleton */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card dark:bg-slate-800 rounded-2xl h-32 border border-gray-100 dark:border-slate-700 p-5 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-slate-700 shrink-0"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-lg w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-lg w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISkeleton;
