import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileUp, UploadCloud, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import type { Department } from '../types';

const uploadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(10, "Please provide a detailed official description"),
  departmentId: z.string().min(1, "Select department"),
  category: z.enum(['Circular', 'Policy', 'Order', 'Gazette', 'Report', 'Memo', 'NOC', 'Tender', 'Financial', 'Other']),
  priority: z.enum(['Low', 'Normal', 'High', 'Urgent']),
  confidentiality: z.enum(['Public', 'Internal', 'Confidential', 'Restricted']),
  tags: z.string().min(2, "Add at least one comma-separated tag (e.g. GST, Tax, 2026)"),
  effectiveDate: z.string().optional()
});

type UploadFormData = z.infer<typeof uploadSchema>;

export const DocumentUploadPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    DataService.getDepartmentsList().then(setDepartments);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      category: 'Policy',
      priority: 'Normal',
      confidentiality: 'Internal',
      departmentId: currentUser?.departmentId || ''
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      
      const allowed = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png'
      ];

      if (!allowed.includes(selected.type) && !selected.name.endsWith('.pdf') && !selected.name.endsWith('.docx')) {
        setFileError('Invalid file type. Only official PDF, DOCX, XLSX, JPG, and PNG documents are allowed.');
        setFile(null);
        return;
      }

      if (selected.size > 25 * 1024 * 1024) {
        setFileError('File size exceeds maximum 25MB security limit.');
        setFile(null);
        return;
      }

      setFile(selected);
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!file) {
      setFileError('Please select or attach an official document file.');
      return;
    }
    if (!currentUser) return;

    setIsUploading(true);
    setUploadProgress(30);

    const selectedDept = departments.find(d => d.id === data.departmentId);

    try {
      const tagList = data.tags.split(',').map(t => t.trim()).filter(Boolean);
      setUploadProgress(60);
      
      const newDoc = await DataService.createDocument({
        title: data.title,
        description: data.description,
        departmentId: data.departmentId,
        departmentName: selectedDept?.name || currentUser.departmentName,
        category: data.category,
        priority: data.priority,
        confidentiality: data.confidentiality,
        tags: tagList,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
        fileBlob: file,
        effectiveDate: data.effectiveDate
      }, currentUser);

      setUploadProgress(100);
      setIsUploading(false);
      navigate(`/documents/${newDoc.id}`);

    } catch (err: any) {
      setIsUploading(false);
      setFileError(err.message || 'Document upload failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Registry</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileUp className="w-6 h-6 text-gov-600 dark:text-gov-400" />
            <span>Upload Official Government Document</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Attach document file, assign confidentiality classification, and register metadata into audit logs.
          </p>
        </div>

        {fileError && (
          <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{fileError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Official Document File (PDF, DOCX, XLSX, Max 25MB) *
            </label>
            
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-gov-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50 dark:bg-slate-850 transition-colors relative cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 rounded-full bg-gov-100 dark:bg-gov-950 text-gov-600 dark:text-gov-400 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              
              {file ? (
                <div>
                  <span className="font-bold text-sm text-gov-600 dark:text-gov-400 block">{file.name}</span>
                  <span className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'Official File'}</span>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Click to select file or drag & drop here</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Supported: PDF, DOCX, XLSX, JPG, PNG</p>
                </div>
              )}
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2 p-4 rounded-xl bg-gov-50 dark:bg-gov-950/60 border border-gov-200 dark:border-gov-800">
              <div className="flex items-center justify-between text-xs font-bold text-gov-800 dark:text-gov-300">
                <span>Uploading to Firebase Encrypted Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gov-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gov-600 dark:text-gov-400 border-b border-slate-200 dark:border-slate-800 pb-1">
              Document Metadata & Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Document Title *</label>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="e.g. State Tax Revenue Optimization & Compliance Policy 2026"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                />
                {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                <select
                  {...register('departmentId')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                >
                  <option value="Policy">Policy</option>
                  <option value="Circular">Circular</option>
                  <option value="Order">Order</option>
                  <option value="Gazette">Gazette</option>
                  <option value="Report">Report</option>
                  <option value="Memo">Memo</option>
                  <option value="NOC">NOC</option>
                  <option value="Tender">Tender</option>
                  <option value="Financial">Financial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Confidentiality Classification *</label>
                <select
                  {...register('confidentiality')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none font-bold text-gov-600 dark:text-gov-400"
                >
                  <option value="Public">Public (Accessible to Citizens & Offices)</option>
                  <option value="Internal">Internal (Restricted to Department Officers)</option>
                  <option value="Confidential">Confidential (Restricted to Reviewers & Admins)</option>
                  <option value="Restricted">Restricted (High Security Cabinet Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Priority Level *</label>
                <select
                  {...register('priority')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                >
                  <option value="Normal">Normal Priority</option>
                  <option value="Low">Low Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent Priority</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (Comma-separated) *</label>
                <input
                  {...register('tags')}
                  type="text"
                  placeholder="e.g. Tax, Revenue, GST, Directives, 2026"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                />
                {errors.tags && <p className="text-[11px] text-rose-600 mt-1">{errors.tags.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Description *</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Provide executive summary and purpose of this document..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                />
                {errors.description && <p className="text-[11px] text-rose-600 mt-1">{errors.description.message}</p>}
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/documents')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md transition-all border border-gov-400/30 flex items-center space-x-2"
            >
              <FileUp className="w-4 h-4" />
              <span>{isUploading ? 'Registering Document...' : 'Submit Document'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
