/**
 * ShareHelper - يساعد على مشاركة التذكيرات عبر Web Share API أو النسخ للحافظة
 */

export const ShareHelper = {
  shareReminder: async (reminderText: string) => {
    const textToShare = `📋 تذكير: ${reminderText}\n\nتم عبر تطبيق Smatry`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'مشاركة التذكير',
          text: textToShare,
        });
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // إذا لم يدعم المتصفح Web Share API، نستخدم النسخ للحافظة
      try {
        await navigator.clipboard.writeText(textToShare);
        alert('تم نسخ التذكير إلى الحافظة');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  }
};
