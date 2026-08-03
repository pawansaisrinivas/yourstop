import { env, isWhatsAppConfigured } from '../config/env.js';
import { BookingRecord } from './supabase.js';

export const sendWhatsAppNotification = async (booking: BookingRecord) => {
  const adminMessage = `🚀 *New YourStop Studio Booking*

*Booking ID:* ${booking.booking_id}
*Customer:* ${booking.customer_name}
*Business:* ${booking.business_name || 'N/A'}
*Service:* ${booking.selected_service}
*Budget:* ${booking.budget}
*Deadline:* ${booking.deadline}
*Phone:* ${booking.phone}
*WhatsApp:* ${booking.whatsapp || booking.phone}

*Project:* ${booking.project_description.slice(0, 150)}...`;

  if (isWhatsAppConfigured()) {
    try {
      const url = `https://graph.facebook.com/v18.0/${env.META_WHATSAPP_PHONE_NUMBER_ID}/messages`;
      
      // Dispatch alert to Admin WhatsApp
      await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.META_WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: env.META_WHATSAPP_ADMIN_NUMBER.replace(/\D/g, ''),
          type: 'text',
          text: { body: adminMessage },
        }),
      });

      console.log(`[Meta WhatsApp] Dispatched notification for booking ${booking.booking_id}`);
      return { success: true };
    } catch (error: any) {
      console.error('[Meta WhatsApp Error]:', error.message || error);
      // Ensure failure never blocks booking submission
      return { success: false, error: error.message };
    }
  } else {
    console.log(`[Meta WhatsApp Simulated Log] WhatsApp notification ready for ${env.META_WHATSAPP_ADMIN_NUMBER}: ${booking.booking_id}`);
    return { success: true, simulated: true };
  }
};

export const generateWhatsAppClickUrl = (bookingId: string, serviceName: string) => {
  const cleanPhone = env.META_WHATSAPP_ADMIN_NUMBER.replace(/\D/g, '') || '917995481098';
  const text = encodeURIComponent(`Hi YourStop Studio! I have just submitted a booking request for *${serviceName}* (Booking ID: *${bookingId}*). Looking forward to discussing details!`);
  return `https://wa.me/${cleanPhone}?text=${text}`;
};
