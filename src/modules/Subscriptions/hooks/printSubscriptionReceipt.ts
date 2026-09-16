// utils/printSubscriptionReceipt.ts
import { toast } from 'sonner';

export interface SubscriptionReceiptData {
  childName: string;
  amount: number;
  monthSubscription: string; // شهر الاشتراك (YYYY-MM-DD)
  dateOfPayment: string;     // تاريخ الدفع الفعلي
  remainder: number;
  receiptNo: string;
}

export interface CenterInfo {
  name: string;
  phone: string;
  address: string;
  logoUrl: string;
}

export function printSubscriptionReceipt(data: SubscriptionReceiptData, centerInfo: CenterInfo) {
  const logoHtml = centerInfo.logoUrl
    ? `<img src="${centerInfo.logoUrl}" alt="logo" style="height:60px;margin-bottom:6px;" />`
    : '';

  const monthLabel = data.monthSubscription
    ? new Date(data.monthSubscription).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })
    : '—';

  const paymentDateLabel = data.dateOfPayment
    ? new Date(data.dateOfPayment).toLocaleString('ar-EG', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      })
    : '—';

  const receiptHtml = `
    <div class="receipt">
      <div class="receipt-header">
        ${logoHtml}
        <h1>${centerInfo.name}</h1>
        <p>${centerInfo.address}</p>
        <p>${centerInfo.phone}</p>
        <div class="divider">* * * * * * * * * * * * * * * * * *</div>
        <div class="copy-badge">وصل اشتراك</div>
        <div class="divider">- - - - - - - - - - - - - - - - - -</div>
      </div>
      <table class="info-table">
        <tr><td class="label">رقم الوصل</td><td class="value">#${data.receiptNo}</td></tr>
        <tr><td class="label">التاريخ</td><td class="value"><span dir="ltr" style="unicode-bidi: isolate;">${paymentDateLabel}</span></td></tr>
        <tr><td class="label">اسم الطالب</td><td class="value bold">${data.childName}</td></tr>
        <tr><td class="label">شهر الاشتراك</td><td class="value">${monthLabel}</td></tr>
      </table>
      <div class="divider">- - - - - - - - - - - - - - - - - -</div>
      <table class="amounts-table">
        <tr class="paid-row">
          <td class="label big">المبلغ المدفوع</td>
          <td class="value big paid">${data.amount.toLocaleString('ar-EG')} ج</td>
        </tr>
        ${data.remainder > 0 ? `
        <tr class="remaining-row">
          <td class="label">المتبقي</td>
          <td class="value remaining">${data.remainder.toLocaleString('ar-EG')} ج</td>
        </tr>` : ''}
      </table>
      <div class="divider">- - - - - - - - - - - - - - - - - *</div>
      <div class="status-badge ${data.remainder > 0 ? 'status-partial' : 'status-paid'}">
        ${data.remainder > 0 ? 'مدفوع جزئياً' : 'مدفوع بالكامل'}
      </div>
      <div class="divider">* * * * * * * * * * * * * * * * * *</div>
      <p class="footer">شكراً لثقتكم في ${centerInfo.name}</p>
      <p class="footer small">طُبع بتاريخ: <span dir="ltr" style="unicode-bidi: isolate;">${new Date().toLocaleString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></p>
    </div>
  `;

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8" />
      <title>وصل اشتراك - ${data.childName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; background: #e5e7eb; display: flex; justify-content: center; padding: 20px; direction: rtl; }
        .receipt { width: 80mm; background: #fff; padding: 14px 12px; font-size: 12px; line-height: 1.6; color: #111; border: 1px dashed #ccc; }
        .receipt-header { text-align: center; margin-bottom: 8px; }
        .receipt-header h1 { font-size: 16px; font-weight: 900; color: #1e40af; margin-bottom: 2px; }
        .receipt-header p { font-size: 11px; color: #555; margin: 1px 0; }
        .copy-badge { display: inline-block; background: #1e40af; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 14px; border-radius: 20px; margin: 4px 0; }
        .divider { color: #999; font-size: 10px; text-align: center; margin: 6px 0; letter-spacing: 1px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
        .info-table tr td { padding: 3px 2px; vertical-align: middle; }
        .info-table .label { color: #555; font-size: 11px; width: 45%; }
        .info-table .value { font-weight: 600; font-size: 12px; text-align: right; }
        .info-table .value.bold { font-weight: 900; font-size: 13px; color: #1e3a8a; }
        .amounts-table { width: 100%; border-collapse: collapse; margin: 4px 0; }
        .amounts-table tr td { padding: 4px 2px; vertical-align: middle; }
        .amounts-table .label { color: #444; font-size: 11px; width: 50%; }
        .amounts-table .label.big { font-size: 13px; font-weight: 700; color: #111; }
        .amounts-table .value { font-weight: 700; font-size: 12px; text-align: right; }
        .amounts-table .value.big { font-size: 17px; font-weight: 900; }
        .amounts-table .value.paid { color: #15803d; }
        .amounts-table .value.remaining { color: #d97706; font-weight: 800; }
        .paid-row { border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; background: #f0fdf4; }
        .paid-row td { padding: 6px 2px; }
        .remaining-row { background: #fffbeb; }
        .remaining-row td { padding: 4px 2px; }
        .status-badge { text-align: center; font-weight: 800; font-size: 13px; padding: 5px; border-radius: 6px; margin: 6px 0; }
        .status-paid { background: #dcfce7; color: #15803d; }
        .status-partial { background: #fef3c7; color: #b45309; }
        .footer { text-align: center; color: #666; font-size: 11px; margin-top: 4px; }
        .footer.small { font-size: 10px; color: #999; margin-top: 2px; }
        @media print {
          body { background: white; padding: 0; }
          .receipt { border: none; }
        }
      </style>
    </head>
    <body>${receiptHtml}</body>
    </html>
  `;

  const win = window.open('', '_blank', 'width=750,height=600');
  if (!win) {
    toast.error('يرجى السماح بالنوافذ المنبثقة لطباعة الوصل');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    win.focus();
    win.print();
  };
}