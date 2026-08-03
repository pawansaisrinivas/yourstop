import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { saveContact } from '../services/supabase';
import { verifyTurnstileToken } from '../services/turnstile';

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  turnstileToken: z.string().optional(),
});

contactRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = contactSchema.parse(req.body);

    const turnstileResult = await verifyTurnstileToken(validated.turnstileToken, req.ip);
    if (!turnstileResult.success) {
      res.status(400).json({ success: false, error: turnstileResult.message });
      return;
    }

    const saved = await saveContact({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      subject: validated.subject,
      message: validated.message,
    });

    res.status(201).json({
      success: true,
      message: 'Contact message received. We will respond shortly!',
      data: saved,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0]?.message || 'Invalid contact data' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to process contact message' });
    }
  }
});
