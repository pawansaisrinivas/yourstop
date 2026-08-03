import { Router, Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { saveBooking, getBookings, updateBookingStatus, deleteBooking } from '../services/supabase';
import { verifyTurnstileToken } from '../services/turnstile';
import { validateUploadedFile, uploadReferenceFileToSupabase } from '../services/storage';
import { sendBookingNotificationEmails } from '../services/resend';
import { sendWhatsAppNotification, generateWhatsAppClickUrl } from '../services/whatsapp';
import { requireAdmin } from '../middleware/adminAuth';
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
export const bookingRouter = Router();

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  business_name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Valid phone number required'),
  whatsapp: z.string().optional(),
  instagram_handle: z.string().optional(),
  website: z.string().optional(),
  selected_service: z.string().min(1, 'Please select a service'),
  budget: z.string().min(1, 'Please select a budget range'),
  deadline: z.string().min(1, 'Please select a deadline'),
  project_description: z.string().min(10, 'Description must be at least 10 characters'),
  preferred_communication: z.enum(['WhatsApp', 'Phone', 'Email', 'Instagram']),
  turnstileToken: z.string().optional(),
});

const generateHumanBookingId = (): string => {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `YSS-${year}-${random}`;
};

bookingRouter.post('/', upload.single('reference_file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = bookingSchema.parse(req.body);

    const turnstileResult = await verifyTurnstileToken(validatedData.turnstileToken, req.ip);
    if (!turnstileResult.success) {
      res.status(400).json({ success: false, error: turnstileResult.message });
      return;
    }

    const file = req.file;
    const fileValidation = validateUploadedFile(file);
    if (!fileValidation.valid) {
      res.status(400).json({ success: false, error: fileValidation.error });
      return;
    }

    const booking_id = generateHumanBookingId();

    let filePath: string | undefined;
    let fileName: string | undefined;
    if (file) {
      const uploadRes = await uploadReferenceFileToSupabase(file, booking_id);
      filePath = uploadRes.path;
      fileName = uploadRes.name;
    }

    const bookingRecord = await saveBooking({
      booking_id,
      customer_name: validatedData.customer_name,
      business_name: validatedData.business_name,
      email: validatedData.email,
      phone: validatedData.phone,
      whatsapp: validatedData.whatsapp || validatedData.phone,
      instagram_handle: validatedData.instagram_handle,
      website: validatedData.website,
      selected_service: validatedData.selected_service,
      budget: validatedData.budget,
      deadline: validatedData.deadline,
      project_description: validatedData.project_description,
      preferred_communication: validatedData.preferred_communication,
      reference_file_path: filePath,
      reference_file_name: fileName,
      status: 'New',
      internal_notes: '',
    });

    sendBookingNotificationEmails(bookingRecord).catch(err => console.error('Email error:', err));
    sendWhatsAppNotification(bookingRecord).catch(err => console.error('WhatsApp error:', err));

    const whatsappClickUrl = generateWhatsAppClickUrl(bookingRecord.booking_id, bookingRecord.selected_service);

    res.status(201).json({
      success: true,
      message: 'Booking successfully submitted',
      data: {
        booking_id: bookingRecord.booking_id,
        customer_name: bookingRecord.customer_name,
        selected_service: bookingRecord.selected_service,
        created_at: bookingRecord.created_at,
        whatsapp_url: whatsappClickUrl,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0]?.message || 'Invalid booking data' });
    } else {
      console.error('Booking Creation Error:', error);
      res.status(500).json({ success: false, error: 'Internal server error while processing booking' });
    }
  }
});

bookingRouter.get('/', async (req: Request, res: Response) => {
  try {
    const bookings = await getBookings();
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve bookings' });
  }
});

bookingRouter.patch('/:booking_id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { booking_id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      res.status(400).json({ success: false, error: 'Status field is required' });
      return;
    }

    const updated = await updateBookingStatus(booking_id, status, notes);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Booking record not found' });
      return;
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update booking status' });
  }
});

bookingRouter.delete('/:booking_id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { booking_id } = req.params;
    const deleted = await deleteBooking(booking_id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Booking record not found' });
      return;
    }

    res.json({ success: true, message: `Booking ${booking_id} permanently deleted` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete booking record' });
  }
});
