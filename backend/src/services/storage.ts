import { supabaseAdmin } from './supabase.js';

const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.doc', '.docx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateUploadedFile = (file?: Express.Multer.File): FileValidationResult => {
  if (!file) return { valid: true }; // File is optional

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit.' };
  }

  const fileExt = '.' + file.originalname.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
    return { valid: false, error: `Invalid file extension (${fileExt}). Allowed extensions: PDF, PNG, JPG, JPEG, WEBP, DOC, DOCX` };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return { valid: false, error: `Invalid MIME type (${file.mimetype}).` };
  }

  return { valid: true };
};

export const uploadReferenceFileToSupabase = async (file: Express.Multer.File, bookingId: string) => {
  const fileExt = file.originalname.split('.').pop()?.toLowerCase();
  const randomHash = Math.random().toString(36).substring(2, 8);
  const filePath = `references/${bookingId}/${Date.now()}-${randomHash}.${fileExt}`;

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from('booking-references')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error('[Supabase Storage Upload Error]:', error.message);
        return { success: false, path: filePath, name: file.originalname };
      }

      return { success: true, path: data.path, name: file.originalname };
    } catch (err: any) {
      console.error('[Storage Error]:', err);
      return { success: false, path: filePath, name: file.originalname };
    }
  }

  // Local fallback storage descriptor
  console.log(`[Storage Simulated Upload] File ${file.originalname} stored for ${bookingId} at ${filePath}`);
  return { success: true, path: filePath, name: file.originalname };
};
