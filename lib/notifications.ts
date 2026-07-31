import { prisma } from './prisma';

export type NotificationCategory = 
  | 'MEMBERSHIP' 
  | 'CONTACT' 
  | 'EVENT' 
  | 'VOLUNTEER' 
  | 'SYSTEM'
  | 'GALLERY'
  | 'SECURITY';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface CreateNotificationParams {
  title: string;
  description?: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  link?: string;
  relatedId?: string;
  metadata?: any;
}

export async function createAdminNotification({
  title,
  description,
  category,
  priority = 'LOW',
  link,
  relatedId,
  metadata
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        description,
        category,
        priority,
        link,
        relatedId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
    return notification;
  } catch (error) {
    console.error('Failed to create admin notification:', error);
    // Suppress error so we don't crash main workflows just because notification failed
    return null;
  }
}
