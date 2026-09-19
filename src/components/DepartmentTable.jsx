import React from 'react';
import { useTranslation } from 'react-i18next';

const DepartmentTable = () => {
  const { t } = useTranslation();

  return (
    <section className="rounded-xl border border-[#d9e2ec] bg-white p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#243B53]">
            {t('performance.departmentProgress', 'Department Evaluation Progress')}
          </h2>
          <p className="mt-1 text-sm text-[#829ab1]">
            {t('performance.departmentProgressSubtitle', 'Completion status across departments for the active review cycle.')}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="border-b border-[#d9e2ec] text-xs uppercase tracking-wide text-[#829ab1]">
            <tr>
              <th className="pb-3">{t('performance.departmentName', 'Department Name')}</th>
              <th className="pb-3">{t('performance.assignedManager', 'Assigned Manager')}</th>
              <th className="pb-3">{t('performance.totalEmployees', 'Total Employees')}</th>
              <th className="pb-3">{t('performance.completedPending', 'Completed / Pending')}</th>
              <th className="pb-3">{t('performance.progress', 'Progress')}</th>
              <th className="pb-3">{t('performance.cycleStatus', 'Cycle Status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef1f4]">
            <tr>
              <td className="py-4 font-semibold text-[#243B53]">{t('performance.engineering', 'Engineering')}</td>
              <td className="py-4 text-[#627d98]">Omar Nabil</td>
              <td className="py-4 text-[#627d98]">24</td>
              <td className="py-4 text-[#627d98]">18 / 6</td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-28 rounded-full bg-[#eef1f4]">
                    <div className="h-full rounded-full bg-[#5b8c6a]" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-[#627d98]">75%</span>
                </div>
              </td>
              <td className="py-4">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-[#e8f3eb] text-[#3f7d5a]">
                  <span className="size-1.5 rounded-full bg-current"></span>{t('performance.onTrack', 'On Track')}
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-4 font-semibold text-[#243B53]">{t('performance.operations', 'Operations')}</td>
              <td className="py-4 text-[#627d98]">Mona Adel</td>
              <td className="py-4 text-[#627d98]">18</td>
              <td className="py-4 text-[#627d98]">11 / 7</td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-28 rounded-full bg-[#eef1f4]">
                    <div className="h-full rounded-full bg-[#5b8c6a]" style={{ width: '61.11%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-[#627d98]">61%</span>
                </div>
              </td>
              <td className="py-4">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-[#fbf2df] text-[#9b6b1e]">
                  <span className="size-1.5 rounded-full bg-current"></span>{t('performance.needsAttention', 'Needs Attention')}
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-4 font-semibold text-[#243B53]">{t('performance.sales', 'Sales')}</td>
              <td className="py-4 text-[#627d98]">Youssef Lotfy</td>
              <td className="py-4 text-[#627d98]">16</td>
              <td className="py-4 text-[#627d98]">14 / 2</td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-28 rounded-full bg-[#eef1f4]">
                    <div className="h-full rounded-full bg-[#5b8c6a]" style={{ width: '87.5%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-[#627d98]">88%</span>
                </div>
              </td>
              <td className="py-4">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-[#e8f3eb] text-[#3f7d5a]">
                  <span className="size-1.5 rounded-full bg-current"></span>{t('performance.onTrack', 'On Track')}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DepartmentTable;