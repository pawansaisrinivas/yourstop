import { Router, Request, Response } from 'express';
import { getBookings } from '../services/supabase';
import { requireAdmin } from '../middleware/adminAuth';

export const adminRouter = Router();

// =========================================================
// ALL ADMIN ROUTES BELOW THIS LINE REQUIRE AUTHENTICATION
// =========================================================

adminRouter.use(requireAdmin);

// =========================================================
// ADMIN STATS
// =========================================================

adminRouter.get(
  '/stats',
  async (req: Request, res: Response) => {
    try {
      const bookings = await getBookings();

      const totalBookings = bookings.length;

      const newLeads = bookings.filter(
        (b) => b.status === 'New'
      ).length;

      const activeProjects = bookings.filter((b) =>
        [
          'Discussion',
          'Quotation Sent',
          'Confirmed',
          'In Progress',
          'Review',
        ].includes(b.status)
      ).length;

      const completedProjects = bookings.filter(
        (b) => b.status === 'Completed'
      ).length;

      const cancelledProjects = bookings.filter(
        (b) => b.status === 'Cancelled'
      ).length;

      const serviceDistribution: Record<string, number> = {};

      bookings.forEach((b) => {
        serviceDistribution[b.selected_service] =
          (serviceDistribution[b.selected_service] || 0) + 1;
      });

      res.json({
        success: true,

        data: {
          totalBookings,
          newLeads,
          activeProjects,
          completedProjects,
          cancelledProjects,
          serviceDistribution,
          recentActivity: bookings.slice(0, 5),
        },
      });
    } catch (error) {
      console.error('[Admin Stats Error]', error);

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve admin stats',
      });
    }
  }
);