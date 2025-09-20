'use client';

import { useState } from 'react';

interface CreateChallengeFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function CreateChallengeForm({ onClose, onSubmit, initialData }: CreateChallengeFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Web',
    difficulty: initialData?.difficulty || 'Facile',
    points: initialData?.points || 100,
    flag: initialData?.flag || '',
    fileUrl: initialData?.fileUrl || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, fileUrl: data.fileUrl }));
        return data.fileUrl;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {initialData ? 'Modifier le Challenge' : 'Créer un Challenge'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Titre du challenge"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value="Web" className="bg-slate-800">Web</option>
                <option value="Crypto" className="bg-slate-800">Crypto</option>
                <option value="Reverse" className="bg-slate-800">Reverse</option>
                <option value="Forensics" className="bg-slate-800">Forensics</option>
                <option value="Pwn" className="bg-slate-800">Pwn</option>
                <option value="Misc" className="bg-slate-800">Misc</option>
                <option value="Osint" className="bg-slate-800">Osint</option>
                <option value="Stégano" className="bg-slate-800">Stégano</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulté *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value="Facile" className="bg-slate-800">Facile</option>
                <option value="Moyen" className="bg-slate-800">Moyen</option>
                <option value="Difficile" className="bg-slate-800">Difficile</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Points *
              </label>
              <input
                type="number"
                min="0"
                max="10000"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Description du challenge"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Flag *
            </label>
            <input
              type="text"
              value={formData.flag}
              onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="CTF{...}"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Statut
            </label>
            <select
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="active" className="bg-slate-800">Actif</option>
              <option value="inactive" className="bg-slate-800">Inactif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fichier à joindre (optionnel)
            </label>
            <div className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                accept=".zip,.rar,.7z,.tar,.gz,.pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.exe,.bin"
              />
              {selectedFile && (
                <div className="text-sm text-gray-300">
                  Fichier sélectionné : {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              {isUploading && (
                <div className="text-cyan-400 text-sm">
                  Upload en cours...
                </div>
              )}
              {formData.fileUrl && (
                <div className="text-green-400 text-sm">
                  ✓ Fichier uploadé avec succès
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Formats acceptés : ZIP, RAR, PDF, images, vidéos, exécutables (max 10MB)
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-500/20 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50"
            >
              {isLoading ? (initialData ? 'Mise à jour...' : 'Création...') : isUploading ? 'Upload...' : (initialData ? 'Mettre à jour' : 'Créer le Challenge')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
