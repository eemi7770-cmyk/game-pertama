import React, { useState } from 'react';
import { X, Save, School, User, Award, Calendar } from 'lucide-react';
import { SchoolInfo } from '../types';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolInfo;
  onSave: (info: SchoolInfo) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  schoolInfo,
  onSave,
}) => {
  const [formData, setFormData] = useState<SchoolInfo>(schoolInfo);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-sky-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Identitas Sekolah & Guru</h3>
              <p className="text-xs text-sky-100">Sesuaikan data untuk kop laporan nilai siswa</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nama Sekolah
            </label>
            <div className="relative">
              <School className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                placeholder="Contoh: SD Negeri 01 Pagi"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kelas
              </label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                placeholder="Kelas V (Lima)"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tahun Ajaran
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                  placeholder="2024 / 2025"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Guru Pengampu
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                  placeholder="Emi, S.Pd."
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                NIP Guru (Opsional)
              </label>
              <input
                type="text"
                value={formData.teacherNip}
                onChange={(e) => setFormData({ ...formData, teacherNip: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                placeholder="19880517 201101 2 003"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                placeholder="Drs. H. Mulyadi, M.Pd."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                KKM / Kriteria Tuntas
              </label>
              <div className="relative">
                <Award className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={formData.kkm}
                  onChange={(e) => setFormData({ ...formData, kkm: Number(e.target.value) || 75 })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-200 transition-all"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
